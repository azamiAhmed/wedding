import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { guests, siteConfig } from './schema'
import { config } from 'dotenv'

config()

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({ client: sql })

async function seed() {
  await db
    .insert(guests)
    .values({
      slug: 'testguest1',
      firstName: 'Youssef',
      lastName: 'El Amrani',
      maxPersons: 3,
    })
    .onConflictDoNothing()

  await db
    .insert(siteConfig)
    .values([
      { key: 'show_venue', value: 'true' },
      { key: 'show_program', value: 'true' },
    ])
    .onConflictDoNothing()

  console.log('Seed complete')
}

seed()
  .catch(console.error)
  .finally(() => process.exit())
