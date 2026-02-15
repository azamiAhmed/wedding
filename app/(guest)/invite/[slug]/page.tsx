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

  return (
    <>
      <HeroSection guestName={guest.firstName} />
      <InfoSection />
      <TimelineSection />
      {showVenue && <VenueSection />}
      {showProgram && <ProgramSection />}
      <RsvpOverlay
        slug={slug}
        guestFirstName={guest.firstName}
        initialStatus={guest.status}
        initialPersonsConfirmed={guest.personsConfirmed}
      />
    </>
  )
}
