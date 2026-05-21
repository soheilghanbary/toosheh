import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { clipsRoutes } from '@/server/routes/clip.route'
import { cronRoutes } from '@/server/routes/crop.route'

// initialize hono app
export const app = new Hono()
export type ApiRoutes = typeof apiRoutes

// middlewares
app.use('*', logger())

// routes
const apiRoutes = app
  .basePath('/api')
  .route('/clips', clipsRoutes)
  .route('/cron', cronRoutes)
