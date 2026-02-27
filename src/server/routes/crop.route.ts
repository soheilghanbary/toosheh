import { lt } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '@/server/db'
import { clip } from '@/server/db/schema'

export const cronRoutes = new Hono()

cronRoutes.get('/cleanup', async (c) => {
  // امنیت: چک کردن هدر مخصوص برای اینکه فقط کرون‌جاب بتونه این روت رو صدا بزنه
  const authHeader = c.req.header('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const now = new Date()

    // حذف تمام رکوردهایی که expiresAt آن‌ها کوچکتر از "الان" است
    const deletedClips = await db
      .delete(clip)
      .where(lt(clip.expiresAt, now))
      .returning({ id: clip.id })

    return c.json({
      success: true,
      message: `${deletedClips.length} clips cleaned up.`,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cleanup failed:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})
