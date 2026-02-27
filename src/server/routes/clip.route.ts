import { and, eq, gt, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { customAlphabet } from 'nanoid'
import { db } from '@/server/db'
import { clip } from '@/server/db/schema'

export const clipRoutes = new Hono()
const generateCode = customAlphabet('0123456789', 6)

const calculateExpiry = (expiration: string): Date => {
  const now = new Date()
  const msInMinute = 60 * 1000
  const msInHour = 60 * msInMinute

  switch (expiration) {
    case '5m':
      return new Date(now.getTime() + 5 * msInMinute)
    case '10m':
      return new Date(now.getTime() + 10 * msInMinute)
    case '30m':
      return new Date(now.getTime() + 30 * msInMinute)
    case '1h':
      return new Date(now.getTime() + 1 * msInHour)
    case '12h':
      return new Date(now.getTime() + 12 * msInHour)
    case '24h':
      return new Date(now.getTime() + 24 * msInHour)
    default:
      return new Date(now.getTime() + 1 * msInHour) // پیش‌فرض منطقی
  }
}

clipRoutes
  .post('/', async (c) => {
    try {
      const body = await c.req.json()
      const expiresAt = calculateExpiry(body.expiration)
      const shortCode = generateCode()
      const newClip = await db
        .insert(clip)
        .values({
          type: body.type,
          code: shortCode,
          title: body.title,
          content: body.content,
          expiresAt: expiresAt,
          hasPassword: body.hasPassword,
          password: body.hasPassword ? body.password : null,
          isOneTime: body.isOneTime,
        })
        .returning({ id: clip.id })
      return c.json(
        {
          success: true,
          id: newClip[0].id,
          code: shortCode,
        },
        201
      )
    } catch (_error) {
      return c.json(
        {
          success: false,
          message: 'خطا در ثبت اطلاعات',
        },
        400
      )
    }
  })
  .post('/track', async (c) => {
    try {
      const now = new Date()
      const { code, password } = await c.req.json()

      // ۱. ابتدا فقط کلیپ را پیدا می‌کنیم (بدون آپدیت بازدید)
      const result = await db
        .select()
        .from(clip)
        .where(and(eq(clip.code, code), gt(clip.expiresAt, now)))
        .limit(1)

      const targetClip = result[0]

      if (!targetClip) {
        return c.json(
          { success: false, message: 'توشه یافت نشد یا منقضی شده است' },
          404
        )
      }

      // ۲. مدیریت رمز عبور
      if (targetClip.hasPassword) {
        // اگر کاربر هنوز رمزی نفرستاده (مرحله اول دست‌تکانی)
        if (!password) {
          return c.json({
            success: true,
            requiresPassword: true,
            data: { code: targetClip.code, title: targetClip.title },
          })
        }

        // اگر رمز فرستاده شده ولی با دیتابیس یکی نیست
        if (targetClip.password !== password) {
          return c.json({ success: false, message: 'رمز عبور نادرست است' }, 401)
        }
      }

      // ۳. حالا که رمز تایید شد یا اصلاً رمز نداشت، بازدید را ثبت می‌کنیم
      await db
        .update(clip)
        .set({ views: sql`${clip.views} + 1` })
        .where(eq(clip.id, targetClip.id))

      // ۴. مدیریت یک‌بار مصرف بودن
      if (targetClip.isOneTime) {
        await db.delete(clip).where(eq(clip.id, targetClip.id))
      }

      return c.json({ success: true, data: targetClip }, 200)
    } catch (_err) {
      return c.json({ success: false, message: 'خطای سرور' }, 500)
    }
  })
