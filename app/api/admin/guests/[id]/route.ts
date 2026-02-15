import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { deleteGuest, updateGuest } from '@/lib/db/queries'
import { guestUpdateSchema } from '@/lib/schemas/guest'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token || !(await validateSession(token))) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { id } = await params
    const guestId = parseInt(id, 10)

    if (isNaN(guestId)) {
      return NextResponse.json(
        { error: 'ID invalide', code: 'VALIDATION_ERROR' },
        { status: 400 }
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

    const parsed = guestUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const guest = await updateGuest(guestId, parsed.data)
    if (!guest) {
      return NextResponse.json(
        { error: 'Invité non trouvé', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({ guest })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token || !(await validateSession(token))) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { id } = await params
    const guestId = parseInt(id, 10)

    if (isNaN(guestId)) {
      return NextResponse.json(
        { error: 'ID invalide', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const deleted = await deleteGuest(guestId)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Invité non trouvé', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
