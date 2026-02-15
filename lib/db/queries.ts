import { asc, eq } from 'drizzle-orm'
import { db } from './index'
import { guests, siteConfig, type Guest } from './schema'
import { generateSlug } from '../utils'
import { type GuestCreateInput } from '../schemas/guest'

export async function getGuestBySlug(slug: string) {
  return db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  })
}

export async function getSiteConfig(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteConfig)
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function getAllGuests() {
  return db
    .select()
    .from(guests)
    .orderBy(asc(guests.lastName), asc(guests.firstName))
}

export async function createGuest(data: GuestCreateInput) {
  const slug = generateSlug()
  const result = await db
    .insert(guests)
    .values({ ...data, slug })
    .returning()
  return result[0]
}

export async function deleteGuest(id: number) {
  const result = await db
    .delete(guests)
    .where(eq(guests.id, id))
    .returning()
  return result[0] ?? null
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
