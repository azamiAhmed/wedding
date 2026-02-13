import { notFound } from 'next/navigation'
import { getGuestBySlug, getSiteConfig } from '@/lib/db/queries'
import { HeroSection } from '@/components/guest/hero-section'
import { InfoSection } from '@/components/guest/info-section'
import { VenueSection } from '@/components/guest/venue-section'
import { ProgramSection } from '@/components/guest/program-section'

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
      {showVenue && <VenueSection />}
      {showProgram && <ProgramSection />}
    </>
  )
}
