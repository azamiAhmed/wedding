import { NextResponse } from 'next/server'
import { verifyPassword, createSession, SESSION_DURATION } from '@/lib/auth'
import { loginInputSchema } from '@/lib/schemas/admin'

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 min

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) return false
  return entry.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    entry.count++
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: 'Trop de tentatives, réessayez plus tard',
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const parsed = loginInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const valid = await verifyPassword(parsed.data.password)
    if (!valid) {
      recordFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Mot de passe incorrect', code: 'INVALID_PASSWORD' },
        { status: 401 }
      )
    }

    const token = await createSession()
    const maxAge = SESSION_DURATION / 1000 // convert ms to seconds

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
