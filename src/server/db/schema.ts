import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const clips = pgTable('clips', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 6 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  files: text('files').array().notNull().default([]),
  password: varchar('password', { length: 255 }),
  hasPassword: boolean('has_password').default(false).notNull(),
  isOneTime: boolean('is_one_time').default(false).notNull(),
  views: integer('views').default(1).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Clip = typeof clips.$inferSelect
export type NewClip = typeof clips.$inferInsert
