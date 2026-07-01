import Image from 'next/image'
import { COUPLE, VENUE } from '@/lib/constants'

function VenuePhoto() {
  return (
    <div className="rotate-[-1.5deg] bg-white-broken p-3 pb-8 shadow-[0_18px_44px_-18px_rgba(52,39,31,0.45)]">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-sand">
        <Image
          src={VENUE.photo}
          alt={VENUE.photoAlt}
          fill
          sizes="(max-width: 1024px) 85vw, 40vw"
          className="object-cover"
        />
      </div>
      <p className="mt-2.5 text-center font-script text-2xl text-ink">{VENUE.photoCaption}</p>
    </div>
  )
}

function PinIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-moroccan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s-7-7.58-7-13a7 7 0 0114 0c0 5.42-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function VenueV2() {
  return (
    <section
      className="section-venue min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-10 lg:py-20 bg-transparent"
      role="region"
      aria-label={COUPLE.venueTitle}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-[2rem] md:text-[2.75rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.venueTitle}
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="scroll-reveal mt-10 mx-auto w-full sm:w-[28rem] lg:w-[34rem]">
        <VenuePhoto />
      </div>

      <div className="scroll-reveal mt-10 w-full">
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 border border-gold-moroccan/30 bg-cream-warm/85 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(58,36,52,0.3)]">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold-moroccan/50" />
            <PinIcon />
            <span className="h-px w-10 bg-gold-moroccan/50" />
          </div>

          <p className="font-script text-3xl sm:text-4xl text-brown-deep text-center leading-none">
            {VENUE.name}
          </p>
          <p className="mt-3 font-sans text-sm sm:text-base text-brown-medium text-center">
            {VENUE.address}
          </p>
          <p className="font-sans text-sm sm:text-base text-brown-medium text-center">
            {VENUE.city}
          </p>

          {VENUE.details.length > 0 && (
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-gold-moroccan/20">
              {VENUE.details.map((detail) => (
                <div key={detail.label} className="text-center sm:text-left">
                  <dt className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 font-display text-base sm:text-lg text-brown-deep">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Google Maps embed + itinerary link */}
      <div className="scroll-reveal mt-8 w-full">
        <div className="overflow-hidden rounded-sm border border-gold-moroccan/30 shadow-[0_10px_40px_-20px_rgba(58,36,52,0.3)]">
          <iframe
            src={VENUE.mapsEmbedUrl}
            title={`Carte — ${VENUE.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[220px] w-full sm:h-[300px]"
          />
        </div>
        <div className="mt-5 text-center">
          <a
            href={VENUE.mapsLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gold-moroccan bg-transparent px-6 py-3 font-sans text-sm text-brown-deep transition-colors duration-200 hover:bg-gold-veil/30"
          >
            <PinIcon />
            Itinéraire sur Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
