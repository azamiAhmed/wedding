import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from './db'
import { adminSessions } from './db/schema'

export const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24h in ms

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD
  if (!hash) return false
  return bcrypt.compare(password, hash)
}

export async function createSession(): Promise<string> {
  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  await db.insert(adminSessions).values({ token, expiresAt })
  return token
}

export async function validateSession(token: string): Promise<boolean> {
  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.token, token),
  })
  if (!session) return false
  return session.expiresAt > new Date()
}

export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token || !(await validateSession(token))) {
    redirect('/admin/login')
  }
}
