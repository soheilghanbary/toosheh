import { createHash } from 'node:crypto'
import { os } from '@orpc/server'
import { eq } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import { db } from 'server/db'
import { clips } from 'server/db/schema'
import { z } from 'zod'

const formSchema = z
  .object({
    description: z.string(),
    files: z.array(z.string()).default([]),
    expiration: z.string(),
    hasPassword: z.boolean(),
    password: z.string().optional(),
    isOneTime: z.boolean(),
  })
  .refine(
    (data) => !data.hasPassword || (data.password && data.password.length >= 4),
    { message: 'رمز عبور باید حداقل ۴ کاراکتر باشد', path: ['password'] }
  )

const EXPIRATION_MAP: Record<string, number> = {
  '30m': 30 * 60 * 1000,
  '1h': 1 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export const clipsRouter = {
  /**
   * GET /clips/:code
   */
  getClip: os
    .route({
      method: 'GET',
      path: '/clips/:code',
    })
    .input(
      z.object({
        code: z.string(),
        password: z.string().optional(),
      })
    )
    .errors({
      CLIP_NOT_FOUND: {
        message: 'کلیپ بورد یافت نشد',
      },
      CLIP_EXPIRED: {
        message: 'کلیپ بورد منقضی شده است',
      },
      PASSWORD_REQUIRED: {
        message: 'رمز عبور لازم است',
      },
      INVALID_PASSWORD: {
        message: 'رمز عبور اشتباه است',
      },
    })
    .handler(async ({ input, errors }) => {
      const { code, password } = input
      const [clip] = await db.select().from(clips).where(eq(clips.code, code))
      if (!clip) {
        throw errors.CLIP_NOT_FOUND()
      }
      const now = new Date()
      if (now > new Date(clip.expiresAt)) {
        await db.delete(clips).where(eq(clips.id, clip.id))
        throw errors.CLIP_EXPIRED()
      }
      const hasPassword = !!clip.password
      if (hasPassword) {
        if (!password) {
          throw errors.PASSWORD_REQUIRED()
        }
        const hashed = await hashPassword(password)
        if (hashed !== clip.password) {
          throw errors.INVALID_PASSWORD()
        }
      }
      if (clip.isOneTime) {
        await db.delete(clips).where(eq(clips.id, clip.id))
      } else {
        await db
          .update(clips)
          .set({ views: (clip.views || 0) + 1 })
          .where(eq(clips.id, clip.id))
      }
      const { password: _, ...safeClip } = clip
      return {
        ...safeClip,
        hasPassword,
      }
    }),
  /**
   * POST /clips
   */
  createClip: os
    .route({
      method: 'POST',
      path: '/clips',
    })
    .input(formSchema)
    .handler(async ({ input }) => {
      try {
        const body = input
        let hashedPassword: string | null = null
        const uniqueCode = customAlphabet('0123456789', 6)()
        let hasPassword = false
        if (body.password) {
          hashedPassword = await hashPassword(body.password)
          hasPassword = true
        }
        const duration =
          EXPIRATION_MAP[body.expiration || ''] || EXPIRATION_MAP['24h']
        const expiresAt = new Date(Date.now() + duration)
        const [newClip] = await db
          .insert(clips)
          .values({
            code: uniqueCode,
            description: body.description,
            files: body.files || [],
            password: hashedPassword,
            isOneTime: body.isOneTime || false,
            expiresAt,
            hasPassword,
          })
          .returning()
        return {
          success: true,
          id: newClip.id,
          code: uniqueCode,
        }
      } catch (err) {
        console.error('CREATE CLIP ERROR:', err)
        throw err
      }
    }),
}
