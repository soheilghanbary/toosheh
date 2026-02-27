import { hc } from 'hono/client'
import type { ApiRoutes } from '@/server/main'

// hono rpc client
export const api = hc<ApiRoutes>('/api')
