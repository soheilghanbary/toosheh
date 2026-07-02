import { os } from '@orpc/server'
import { clipsRouter } from './clip-router'

export const router = {
  hello: os
    .route({
      method: 'GET',
    })
    .handler(async () => {
      return { message: 'Hello World!' }
    }),
  clip: clipsRouter,
}
