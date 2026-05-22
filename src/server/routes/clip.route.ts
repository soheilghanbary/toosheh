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
    const [clip] = await db.select().from(clips).where(eq(clips.code, code))
    if (!clip) {
      return c.json({ error: 'Clip not found' }, 404)
    }
    const now = new Date()
    if (clip.expiresAt && now > new Date(clip.expiresAt)) {
      await db.delete(clips).where(eq(clips.id, clip.id))
      return c.json({ error: 'Clip has expired' }, 410) // کد ۴۱۰ (Gone) یا ۴۰۴ مناسب است
    }
    if (clip.isOneTime) {
      await db.delete(clips).where(eq(clips.id, clip.id))
    } else {
      await db
        .update(clips)
        .set({ views: (clip.views || 0) + 1 })
        .where(eq(clips.id, clip.id))
    }

    return c.json(clip)
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
      if (body.password) {
        hashedPassword = await hashPassword(body.password)
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
