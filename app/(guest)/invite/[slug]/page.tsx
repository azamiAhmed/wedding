import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuestBySlug, getSiteConfig } from '@/lib/db/queries'
import { OG } from '@/lib/constants'
import { CollageHome } from '@/components/guest/v2/collage-home'
import { CountdownV2 } from '@/components/guest/v2/countdown-v2'
import { InvitationLetterV2 } from '@/components/guest/v2/invitation-letter-v2'
import { StoryV2 } from '@/components/guest/v2/story-v2'
import { VenueV2 } from '@/components/guest/v2/venue-v2'
import { ProgramV2 } from '@/components/guest/v2/program-v2'
import { DetailsV2 } from '@/components/guest/v2/details-v2'
import { ListeMariageV2 } from '@/components/guest/v2/liste-mariage-v2'
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

/* Dégradé d'opacité continu sur les overlays desktop. Le bas d'une section a la
   même opacité que le haut de la suivante → transition seamless. */
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

  const overlaySections = [
    { key: 'invitation', anchor: 'notre-mariage', show: true, el: <InvitationLetterV2 guestName={guest.firstName} /> },
    { key: 'countdown', show: true, el: <CountdownV2 /> },
    { key: 'story', anchor: 'notre-histoire', show: true, el: <StoryV2 /> },
    { key: 'program', anchor: 'programme', show: showProgram, el: <ProgramV2 /> },
    { key: 'venue', anchor: 'lieu', show: showVenue, el: <VenueV2 /> },
    { key: 'details', anchor: 'infos-pratiques', show: true, el: <DetailsV2 /> },
    { key: 'liste', anchor: 'liste-mariage', show: true, el: <ListeMariageV2 /> },
  ]

  const visible = overlaySections.filter((s) => s.show)
  const count = visible.length
  const step = count > 0 ? (OVERLAY_START - OVERLAY_END) / count : 0

  return (
    <>
      <CollageHome />
      {visible.map((section, i) => {
        const top = OVERLAY_START - step * i
        const bottom = OVERLAY_START - step * (i + 1)
        return (
          <div
            key={section.key}
            id={section.anchor}
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
      <RsvpOverlay
        slug={slug}
        guestFirstName={guest.firstName}
        initialStatus={guest.status}
        initialPersonsConfirmed={guest.personsConfirmed}
      />
    </>
  )
}
