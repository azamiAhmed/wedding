import { NextResponse } from 'next/server'
import { getGuestBySlug } from '@/lib/db/queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const guest = await getGuestBySlug(slug)

    if (!guest) {
      return NextResponse.json(
        { error: 'Invité non trouvé', code: 'GUEST_NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json(guest)
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
