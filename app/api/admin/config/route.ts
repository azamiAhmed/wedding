import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { getSiteConfig, updateSiteConfig } from '@/lib/db/queries'
import { configUpdateSchema } from '@/lib/schemas/config'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token || !(await validateSession(token))) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const config = await getSiteConfig()

    return NextResponse.json({
      showVenue: config.show_venue !== 'false',
      showProgram: config.show_program !== 'false',
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token || !(await validateSession(token))) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
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

    const parsed = configUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const updated = await updateSiteConfig(parsed.data.key, parsed.data.value)
    if (!updated) {
      return NextResponse.json(
        { error: 'Clé de configuration non trouvée', code: 'NOT_FOUND' },
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
