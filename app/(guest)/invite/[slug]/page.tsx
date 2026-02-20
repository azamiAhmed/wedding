import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuestBySlug, getSiteConfig } from '@/lib/db/queries'
import { OG } from '@/lib/constants'
import { HeroSection } from '@/components/guest/hero-section'
import { InfoSection } from '@/components/guest/info-section'
import { VenueSection } from '@/components/guest/venue-section'
import { ProgramSection } from '@/components/guest/program-section'
import { TimelineSection } from '@/components/guest/timeline-section'
import { RsvpOverlay } from '@/components/guest/rsvp-overlay'
import { AllianceRings } from '@/components/guest/alliance-rings'
import { MerciSection } from '@/components/guest/merci-section'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: OG.title,
    description: OG.description,
    openGraph: {
      title: OG.title,
      description: OG.description,
      type: 'website',
    },
  }
}

/* Dégradé d'opacité continu sur les overlays desktop (Info → Merci).
   Chaque section a un ::before en linear-gradient dont le bas correspond
   exactement au haut de la section suivante → transition seamless, aucune
   ligne de démarcation visible. S'adapte au nombre de sections visibles. */
const OVERLAY_START = 0.92
const OVERLAY_END = 0.35

export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const guest = await getGuestBySlug(slug)
  if (!guest) {
    notFound()
  }

  const config = await getSiteConfig()
  const showVenue = config.show_venue !== 'false'
  const showProgram = config.show_program !== 'false'
  const showMerci = config.show_merci !== 'false'

  const overlaySections = [
    { key: 'info', show: true, el: <InfoSection /> },
    { key: 'timeline', show: true, el: <TimelineSection /> },
    { key: 'venue', show: showVenue, el: <VenueSection /> },
    { key: 'program', show: showProgram, el: <ProgramSection /> },
    { key: 'merci', show: showMerci, el: <MerciSection /> },
  ]

  const visible = overlaySections.filter((s) => s.show)
  const count = visible.length
  const step = count > 0 ? (OVERLAY_START - OVERLAY_END) / count : 0

  return (
    <>
      <HeroSection guestName={guest.firstName} />
      {visible.map((section, i) => {
        const top = OVERLAY_START - step * i
        const bottom = OVERLAY_START - step * (i + 1)
        return (
          <div
            key={section.key}
            style={
              {
                '--overlay-bg': `linear-gradient(to bottom,rgba(250,247,242,${top}),rgba(250,247,242,${bottom}))`,
              } as React.CSSProperties
            }
          >
            {section.el}
          </div>
        )
      })}
      <AllianceRings />
      <RsvpOverlay
        slug={slug}
        guestFirstName={guest.firstName}
        initialStatus={guest.status}
        initialPersonsConfirmed={guest.personsConfirmed}
      />
    </>
  )
}
