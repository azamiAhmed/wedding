import { eq } from 'drizzle-orm'
import { db } from './index'
import { guests, siteConfig } from './schema'

export async function getGuestBySlug(slug: string) {
  return db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  })
}

export async function getSiteConfig(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteConfig)
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}
