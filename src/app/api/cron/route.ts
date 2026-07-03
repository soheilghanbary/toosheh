import { and, isNotNull, lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from 'server/db'
import { clips } from 'server/db/schema'

export async function GET() {
  const now = Date.now()
  await db
    .delete(clips)
    .where(and(isNotNull(clips.expiresAt), lt(clips.expiresAt, now)))
  return NextResponse.json({ ok: true })
}
