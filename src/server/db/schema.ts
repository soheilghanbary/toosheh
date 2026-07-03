import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const clips = sqliteTable('clips', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(),
  description: text('description'),
  files: text('files', { mode: 'json' }).$type<string[]>().notNull(),
  password: text('password'),
  hasPassword: integer('has_password', { mode: 'boolean' })
    .default(false)
    .notNull(),
  isOneTime: integer('is_one_time', { mode: 'boolean' })
    .default(false)
    .notNull(),
  views: integer('views').default(1).notNull(),
  expiresAt: integer('expires_at'), // timestamp (ms)
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type Clip = typeof clips.$inferSelect
export type NewClip = typeof clips.$inferInsert
