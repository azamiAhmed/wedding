import { COUPLE, VENUE } from '@/lib/constants'

export function VenueSection() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col justify-center px-6 py-16 bg-white-broken"
      role="region"
      aria-label={COUPLE.venueTitle}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-2xl md:text-[2.5rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.venueTitle}
      </h2>

      <div className="mt-4 mx-auto h-px w-12 bg-gold-moroccan" />

      <p className="mt-4 font-display text-base md:text-lg text-brown-deep text-center">
        {VENUE.name}
      </p>
      <p className="mt-1 font-sans text-xs md:text-sm text-brown-medium text-center">
        {VENUE.address}, {VENUE.city}
      </p>
      <p className="mt-2 font-sans text-xs text-brown-medium italic text-center">
        {VENUE.description}
      </p>

      {VENUE.details.length > 0 && (
        <dl className="mt-6 mx-auto w-full max-w-xs space-y-2">
          {VENUE.details.map((detail) => (
            <div key={detail.label} className="flex justify-between gap-4">
              <dt className="font-sans text-xs text-brown-medium uppercase tracking-wider">
                {detail.label}
              </dt>
              <dd className="font-sans text-xs text-brown-deep text-right">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
