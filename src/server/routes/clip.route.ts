import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from 'server/db'
import { clips } from 'server/db/schema'

const EXPIRATION_MAP: Record<string, number> = {
  '30m': 30 * 60 * 1000,
  '1h': 1 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const clipsRoutes = new Hono()
  .get('/:code', async (c) => {
    const code = c.req.param('code')
    const password = c.req.query('password')

    const [clip] = await db.select().from(clips).where(eq(clips.code, code))

    if (!clip) {
      return c.json({ error: 'CLIP_NOT_FOUND' }, 404)
    }

    const now = new Date()
    if (now > new Date(clip.expiresAt)) {
      await db.delete(clips).where(eq(clips.id, clip.id))
      return c.json({ error: 'Clip has expired' }, 410)
    }

    const hasPassword = !!clip.password

    if (hasPassword) {
      if (!password) {
        return c.json(
          {
            error: 'PASSWORD_REQUIRED',
            requiresPassword: true,
            hasPassword: true,
          },
          401
        )
      }

      const hashed = await hashPassword(password)

      if (hashed !== clip.password) {
        return c.json(
          {
            error: 'INVALID_PASSWORD',
            requiresPassword: true,
            hasPassword: true,
          },
          403
        )
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

    return c.json({
      ...safeClip,
      hasPassword,
    })
  })
  .post('/', async (c) => {
    try {
      const body = await c.req.json()
      let uniqueCode = ''
      let isUnique = false
      while (!isUnique) {
        uniqueCode = Math.floor(100000 + Math.random() * 900000).toString()
        const [existing] = await db
          .select()
          .from(clips)
          .where(eq(clips.code, uniqueCode))
        if (!existing) isUnique = true
      }
      let hashedPassword = null
      let hasPassword = false
      if (body.password) {
        hashedPassword = await hashPassword(body.password)
        hasPassword = true
      }
      const duration = EXPIRATION_MAP[body.expiration] || EXPIRATION_MAP['24h']
      const expiresAt = new Date(Date.now() + duration)
      const [newClip] = await db
        .insert(clips)
        .values({
          code: uniqueCode,
          title: body.title,
          description: body.description,
          files: body.files || [],
          password: hashedPassword,
          isOneTime: body.isOneTime || false,
          expiresAt: expiresAt,
          hasPassword,
        })
        .returning()
      return c.json(
        {
          success: true,
          id: newClip.id,
          code: newClip.code,
        },
        201
      )
    } catch (_error) {
      console.error('Error creating clip:', _error)
      return c.json({ error: 'Failed to create clip' }, 400)
    }
  })
