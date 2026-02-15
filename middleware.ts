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
    const response = NextResponse.redirect(
      new URL('/admin/login', request.url)
    )
    response.cookies.delete('admin_token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
}
