# Story 4.1: Authentification Admin

Status: done

## Story

As a admin (Ahmed ou Ghizlaine),
I want me connecter à l'espace admin avec un mot de passe,
so that je puisse accéder à la gestion des invités de manière sécurisée.

## Acceptance Criteria

1. **Given** un visiteur non authentifié
   **When** il accède à `/admin`
   **Then** il est redirigé vers `/admin/login`

2. **Given** la page `/admin/login`
   **When** elle s'affiche
   **Then** un formulaire simple avec un champ mot de passe et un bouton "Connexion" est visible, dans le layout admin (sans animations, style utilitaire)

3. **Given** le mot de passe correct saisi
   **When** le formulaire est soumis (POST `/api/admin/login`)
   **Then** le mot de passe est vérifié via bcrypt, un token de session est généré (nanoid), stocké dans `admin_sessions`, et un cookie HttpOnly `admin_token` (expiration 24h) est posé. Redirect vers `/admin`.

4. **Given** un mot de passe incorrect
   **When** le formulaire est soumis
   **Then** la réponse est 401 avec un message "Mot de passe incorrect", sans révéler si le compte existe

5. **Given** 5 tentatives échouées en 15 minutes depuis la même IP
   **When** une nouvelle tentative arrive
   **Then** la réponse est 429 "Trop de tentatives, réessayez plus tard"

6. **Given** un admin authentifié avec un cookie `admin_token` valide
   **When** il accède à `/admin`
   **Then** le middleware vérifie le token dans `admin_sessions`, confirme qu'il n'est pas expiré, et autorise l'accès

7. **Given** un cookie `admin_token` expiré ou invalide
   **When** l'admin accède à `/admin`
   **Then** il est redirigé vers `/admin/login`

## Tasks / Subtasks

- [x] Task 1: Implement `lib/auth.ts` (AC: #3, #6, #7)
  - [x] 1.1: Replace placeholder with actual imports: `bcryptjs`, `nanoid`, `db`, `adminSessions` schema, `eq`
  - [x] 1.2: Export `SESSION_DURATION = 24 * 60 * 60 * 1000` (24h in ms)
  - [x] 1.3: `verifyPassword(password: string): Promise<boolean>` — `bcrypt.compare(password, process.env.ADMIN_PASSWORD!)` returning boolean
  - [x] 1.4: `createSession(): Promise<string>` — generate token with `nanoid(32)`, insert into `adminSessions` with `expiresAt = Date.now() + SESSION_DURATION`, return token
  - [x] 1.5: `validateSession(token: string): Promise<boolean>` — find session by token in DB, return false if not found or expired
  - [x] 1.6: `requireAdmin(): Promise<void>` — read `admin_token` cookie from `next/headers`, call validateSession, if invalid → `redirect('/admin/login')`

- [x] Task 2: Create Zod login schema `lib/schemas/admin.ts` (AC: #3, #4)
  - [x] 2.1: Create `loginInputSchema` with `z.object({ password: z.string().min(1) })`
  - [x] 2.2: Export `LoginInput` type

- [x] Task 3: Create `POST /api/admin/login` route handler (AC: #3, #4, #5)
  - [x] 3.1: Create `app/api/admin/login/route.ts`
  - [x] 3.2: Rate limiting: module-level `Map<string, { count: number; resetAt: number }>`, 5 attempts per 15 min per IP
  - [x] 3.3: On rate limit exceeded → return 429 `{ error: 'Trop de tentatives, réessayez plus tard', code: 'RATE_LIMITED' }`
  - [x] 3.4: Parse body with `loginInputSchema.safeParse()`, on error → 400
  - [x] 3.5: Call `verifyPassword()`, on failure → increment counter, return 401 `{ error: 'Mot de passe incorrect', code: 'INVALID_PASSWORD' }`
  - [x] 3.6: On success → call `createSession()`, set cookie `admin_token` (HttpOnly, Secure, SameSite=Lax, Path=/, maxAge=86400), return 200

- [x] Task 4: Create `middleware.ts` (AC: #1, #6, #7)
  - [x] 4.1: Create `middleware.ts` at project root
  - [x] 4.2: Match admin routes: `/admin` and `/admin/:path*` (exclude `/admin/login`)
  - [x] 4.3: Read `admin_token` cookie from request
  - [x] 4.4: If no cookie → redirect to `/admin/login`
  - [x] 4.5: If cookie exists → call `validateSession()` with neon-http driver (Edge-compatible)
  - [x] 4.6: If session invalid/expired → delete cookie + redirect to `/admin/login`
  - [x] 4.7: If session valid → `NextResponse.next()`
  - [x] 4.8: Export `config.matcher` excluding login page and API routes

- [x] Task 5: Create `components/admin/login-form.tsx` (AC: #2, #3, #4, #5)
  - [x] 5.1: Client Component with `"use client"` directive
  - [x] 5.2: Password `<input type="password">` with label "Mot de passe"
  - [x] 5.3: Submit button "Connexion", disabled during loading
  - [x] 5.4: `useState` for password, isLoading, error
  - [x] 5.5: On submit → `POST /api/admin/login` with `{ password }`
  - [x] 5.6: On 200 → `router.push('/admin')` (use `next/navigation`)
  - [x] 5.7: On 401 → show "Mot de passe incorrect"
  - [x] 5.8: On 429 → show "Trop de tentatives, réessayez plus tard"
  - [x] 5.9: Styling: admin utilitaire — shadcn Input + Button, no gold/animations

- [x] Task 6: Create admin login page + update layout (AC: #1, #2)
  - [x] 6.1: Create `app/(admin)/admin/login/page.tsx` — Server Component rendering `<LoginForm />`
  - [x] 6.2: Centered layout: title "Administration" + LoginForm
  - [x] 6.3: Update `app/(admin)/layout.tsx` with admin styling: `max-w-4xl mx-auto px-4 sm:px-8 py-8`, font-sans

- [x] Task 7: Create placeholder admin dashboard page (AC: #6)
  - [x] 7.1: Create `app/(admin)/admin/page.tsx` — Server Component
  - [x] 7.2: Call `requireAdmin()` at top (redirects if not authenticated)
  - [x] 7.3: Show placeholder heading "Dashboard" (actual content in Story 4.2)

- [x] Task 8: Hash the dev ADMIN_PASSWORD in `.env` (AC: #3)
  - [x] 8.1: Generate bcrypt hash of a dev password and update `.env`
  - [x] 8.2: Update `.env.example` with comment about bcrypt hash format

- [x] Task 9: Build + lint verification
  - [x] 9.1: `npm run build` passes
  - [x] 9.2: `npm run lint` passes

## Dev Notes

### Existing Infrastructure

| File | Status | Notes |
|------|--------|-------|
| `lib/db/schema.ts` | READY | `adminSessions` table already defined: `id`, `token` (varchar 64, unique), `expiresAt` (timestamp) |
| `lib/auth.ts` | PLACEHOLDER | Comment only: "verifyPassword, createSession, validateSession" |
| `app/(admin)/layout.tsx` | STUB | Returns `<>{children}</>` — needs admin styling |
| `package.json` | READY | `bcryptjs@3.0.3` + `@types/bcryptjs@2.4.6` + `nanoid@5.1.6` installed |
| `.env` | EXISTS | `ADMIN_PASSWORD=your-secure-password-here` — needs bcrypt hash |
| `lib/db/index.ts` | READY | Uses `neon-http` driver (Edge-compatible — works in middleware) |

### Auth Functions Pattern (`lib/auth.ts`)

```typescript
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { adminSessions } from './db/schema'

export const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24h

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
```

### requireAdmin Helper

```typescript
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token || !(await validateSession(token))) {
    redirect('/admin/login')
  }
}
```

**Usage in admin pages**: Call `await requireAdmin()` at the top of any admin Server Component.

### Rate Limiting Pattern (in API route, NOT middleware)

```typescript
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 min

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    return false // not rate limited
  }
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
```

**Note**: Rate limiting is in the route handler (Node.js runtime), not middleware. The Map resets on cold start — acceptable per architecture doc.

### Middleware Pattern

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  const valid = await validateSession(token)
  if (!valid) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_token')
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/((?!login).*)'],
}
```

**CRITICAL**: `neon-http` driver is Edge-compatible, so `validateSession()` works in middleware.

**Matcher**: `/admin/((?!login).*)` matches all `/admin/*` routes EXCEPT `/admin/login`. Does NOT match API routes (`/api/admin/*`) — API routes handle their own auth.

### Cookie Configuration

```typescript
const cookieOptions = {
  name: 'admin_token',
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 86400, // 24h in seconds
}
```

### Login Form Styling (Admin Utilitaire)

Admin uses functional shadcn/ui styling — NO gold theme, NO animations, NO font-display:
- Background: white or neutral
- Input: shadcn Input component (or plain input with border)
- Button: shadcn Button default variant
- Error: red text below form
- Layout: centered card, max-w-sm

### ADMIN_PASSWORD Hashing

The `ADMIN_PASSWORD` env var must be a **bcrypt hash**, not plaintext.

Generate hash for dev:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h))"
```

### Middleware vs Edge Runtime

`lib/db/index.ts` uses `@neondatabase/serverless` with `drizzle-orm/neon-http` — the HTTP driver is Edge-compatible. This means `validateSession()` can run in middleware without issues.

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `app/api/admin/login/route.ts` | CREATE | POST handler with rate limiting |
| `middleware.ts` | CREATE | Cookie check + session validation for admin routes |
| `components/admin/login-form.tsx` | CREATE | Client Component — password form |
| `app/(admin)/admin/login/page.tsx` | CREATE | Server Component — login page |
| `app/(admin)/admin/page.tsx` | CREATE | Server Component — placeholder dashboard |
| `lib/schemas/admin.ts` | CREATE | Zod schema for login input |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/auth.ts` | REPLACE | Replace placeholder with actual auth functions |
| `app/(admin)/layout.tsx` | MODIFY | Add admin layout styling |
| `.env` | MODIFY | Hash the ADMIN_PASSWORD |
| `.env.example` | MODIFY | Add bcrypt hash comment |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | `adminSessions` table already defined |
| `lib/db/index.ts` | DB connection already configured |
| `lib/db/queries.ts` | Session queries go in auth.ts |
| `app/(guest)/*` | Guest routes not affected |
| `components/guest/*` | Guest components not affected |
| `components/ui/*` | shadcn components, don't modify |

### Accessibility

- Login form: native `<form>`, `<label>` + `<input type="password">`, submit `<button>`
- Error messages: visible text, associated with form via proximity
- Focus: auto-focus on password input on page load
- No ARIA complexity needed — standard form pattern

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 Story 4.1] — AC and BDD criteria (FR21)
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security] — bcrypt, nanoid, HttpOnly cookie, rate limiting
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — admin_sessions table schema
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries] — /api/admin/* requires cookie auth
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin Flowchart] — Login flow, error states
- [Source: lib/db/schema.ts] — adminSessions table definition
- [Source: lib/db/index.ts] — neon-http driver (Edge-compatible)
- [Source: package.json] — bcryptjs@3.0.3, nanoid@5.1.6

### Previous Story Intelligence

**No previous admin stories.** This is the first story in Epic 4.

**From Epic 3 patterns (applicable):**
- Error format: `{ error: string, code: string }` with HTTP status codes
- Client Components: `"use client"`, `useState` for form state, `fetch()` for API calls
- Route handlers: `params: Promise<{}>` must be awaited in Next.js 16
- Zod 4 pattern: `z.object({...})`, `.safeParse()`, `error` param in `.refine()`
- JSON parse error handling: inner try/catch around `request.json()`

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `2b60c49 feat: 3-3-overlay-rsvp-confirmation`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A

### Completion Notes List

- All 9 tasks implemented successfully — full admin auth system from scratch
- `lib/auth.ts` replaced placeholder with 4 exported functions: `verifyPassword`, `createSession`, `validateSession`, `requireAdmin`
- Rate limiting implemented in route handler (Node.js runtime) rather than middleware (Edge runtime) to avoid shared state issues
- `neon-http` driver confirmed Edge-compatible — `validateSession()` works in Next.js middleware
- Dev password `admin123` hashed with bcrypt (cost 10) and stored in `.env`
- Build output confirms all new routes: `/admin` (SSR), `/admin/login` (SSR), `/api/admin/login` (Node.js), Proxy (Middleware)
- `npm run build` and `npm run lint` both pass clean

### Change Log

| File | Action | Description |
|------|--------|-------------|
| `lib/auth.ts` | REPLACED | Full auth implementation: verifyPassword, createSession, validateSession, requireAdmin |
| `lib/schemas/admin.ts` | CREATED | Zod loginInputSchema + LoginInput type |
| `app/api/admin/login/route.ts` | CREATED | POST handler with rate limiting (5/15min per IP), bcrypt verification, session creation, HttpOnly cookie |
| `middleware.ts` | CREATED | Admin route protection — cookie check + DB session validation, excludes /admin/login |
| `components/admin/login-form.tsx` | CREATED | Client Component — password form with loading/error states |
| `app/(admin)/admin/login/page.tsx` | CREATED | Server Component — centered login page with title + LoginForm |
| `app/(admin)/admin/page.tsx` | CREATED | Server Component — placeholder dashboard with requireAdmin() guard |
| `app/(admin)/layout.tsx` | MODIFIED | Added admin styling: max-w-4xl, padding, font-sans |
| `.env` | MODIFIED | ADMIN_PASSWORD changed from plaintext to bcrypt hash |
| `.env.example` | MODIFIED | Added comment about bcrypt hash format + generation command |

### File List

- `lib/auth.ts`
- `lib/schemas/admin.ts`
- `app/api/admin/login/route.ts`
- `middleware.ts`
- `components/admin/login-form.tsx`
- `app/(admin)/admin/login/page.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(admin)/layout.tsx`
- `.env`
- `.env.example`
