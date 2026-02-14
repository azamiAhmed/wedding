import { eq } from 'drizzle-orm'
import { db } from './index'
import { guests, siteConfig, type Guest } from './schema'

export async function getGuestBySlug(slug: string) {
  return db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  })
}

export async function getSiteConfig(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteConfig)
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function updateGuestRsvp(
  slug: string,
  status: Guest['status'],
  personsConfirmed: number
) {
  const result = await db
    .update(guests)
    .set({ status, personsConfirmed })
    .where(eq(guests.slug, slug))
    .returning()
  return result[0] ?? null
}
