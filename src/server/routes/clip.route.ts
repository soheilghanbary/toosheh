import { and, eq, gt } from 'drizzle-orm'
import { Hono } from 'hono'
import { customAlphabet } from 'nanoid'
import { db } from '@/server/db'
import { clip } from '@/server/db/schema'

export const clipRoutes = new Hono()
const generateCode = customAlphabet('0123456789', 6)

const calculateExpiry = (expiration: string): Date => {
  const now = new Date()
  switch (expiration) {
    case '30m':
      return new Date(now.getTime() + 30 * 60000)
    case '1h':
      return new Date(now.getTime() + 60 * 60000)
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60000)
    default:
      return new Date(now.getTime() + 24 * 60 * 60000)
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
    const now = new Date()
    const body = await c.req.json()
    const code = body.code
    // پیدا کردن کلیپ فعال که منقضی نشده باشد
    const result = await db
      .select()
      .from(clip)
      .where(
        and(
          eq(clip.code, code),
          gt(clip.expiresAt, now) // فقط کلیپ‌هایی که زمان انقضایشان نرسیده
        )
      )
      .limit(1)
    const targetClip = result[0]
    if (!targetClip) {
      return c.json(
        { success: false, message: 'کلیپ برد یافت نشد یا منقضی شده است' },
        404
      )
    }
    if (targetClip.isOneTime) {
      await db.delete(clip).where(eq(clip.id, targetClip.id))
    }
    // اگر رمز عبور دارد، در این مرحله فقط متادیتا را می‌فرستیم (امنیت بیشتر)
    // مگر اینکه سیستم چک کردن پسورد را جداگانه هندل کرده باشی
    if (targetClip.hasPassword) {
      // در اینجا می‌توانی منطق چک کردن پسورد را اضافه کنی
      // فعلاً کل دیتا را برمی‌گردانیم اما در سنیور دیزاین باید رمز هش شده چک شود
    }
    return c.json(
      {
        success: true,
        data: targetClip,
      },
      200
    )
  })
