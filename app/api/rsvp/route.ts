import { NextResponse } from 'next/server'
import { createRsvpSubmission } from '@/lib/db/queries'
import { rsvpSubmitSchema } from '@/lib/schemas/guest'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const parsed = rsvpSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const created = await createRsvpSubmission(parsed.data)

    return NextResponse.json(
      {
        slug: created.slug,
        firstName: created.firstName,
        lastName: created.lastName,
        status: created.status,
        personsConfirmed: created.personsConfirmed,
      },
      { status: 201 }
    )
  } catch (e) {
    console.error('[POST /api/rsvp] échec création RSVP:', e)
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
