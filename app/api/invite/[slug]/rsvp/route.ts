import { NextResponse } from 'next/server'
import { getGuestBySlug, updateGuestRsvp } from '@/lib/db/queries'
import { rsvpInputSchema } from '@/lib/schemas/rsvp'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const parsed = rsvpInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const guest = await getGuestBySlug(slug)
    if (!guest) {
      return NextResponse.json(
        { error: 'Invité non trouvé', code: 'GUEST_NOT_FOUND' },
        { status: 404 }
      )
    }

    const { status, personsConfirmed } = parsed.data
    const finalPersonsConfirmed =
      status === 'declined' ? 0 : personsConfirmed ?? 0

    const updated = await updateGuestRsvp(slug, status, finalPersonsConfirmed)

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
