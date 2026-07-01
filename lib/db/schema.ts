import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'

export const guests = pgTable('guests', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 10 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  groupName: varchar('group_name', { length: 100 }),
  category: varchar('category', { length: 20 }),
  maxPersons: integer('max_persons').notNull().default(1),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  personsConfirmed: integer('persons_confirmed').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export const siteConfig = pgTable('site_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).unique().notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export const adminSessions = pgTable('admin_sessions', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 64 }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

export type Guest = typeof guests.$inferSelect
export type NewGuest = typeof guests.$inferInsert
export type SiteConfig = typeof siteConfig.$inferSelect
export type AdminSession = typeof adminSessions.$inferSelect
