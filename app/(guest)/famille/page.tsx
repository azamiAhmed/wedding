import type { Metadata } from 'next'
import { OG } from '@/lib/constants'
import { InviteExperience } from '@/components/guest/invite-experience'

// Rendu à la demande : les toggles de sections (site_config) restent live.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: OG.title,
  description: OG.description,
  openGraph: {
    title: OG.title,
    description: OG.description,
    type: 'website',
  },
}

export default function FamillePage() {
  return <InviteExperience category="famille" />
}
