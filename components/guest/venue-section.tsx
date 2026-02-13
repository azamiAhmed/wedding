import { COUPLE } from '@/lib/constants'

export function VenueSection() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 bg-white-broken"
      role="region"
      aria-label="Lieu de la cérémonie"
    >
      <h2 className="w-full font-display text-4xl md:text-[3.5rem] text-brown-deep text-center leading-tight">
        {COUPLE.venueTitle}
      </h2>
      <div className="mt-8 w-full max-w-md text-center space-y-4">
        <p className="font-sans text-lg text-brown-deep">
          {COUPLE.venueText}
        </p>
      </div>
    </section>
  )
}
