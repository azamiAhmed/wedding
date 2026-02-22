import { COUPLE, PROGRAM_EVENTS, type ProgramEvent } from '@/lib/constants'

function ProgramIcon({
  icon,
}: {
  icon: ProgramEvent['icon']
}) {
  const className = 'h-8 w-8 text-gold-moroccan'

  switch (icon) {
    case 'welcome':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
        </svg>
      )
    case 'ceremony':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case 'cocktail':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 2l8 0M12 11v11M8 22h8M5 2l7 9 7-9" />
        </svg>
      )
    case 'dinner':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12h18M12 3a9 9 0 00-9 9M12 3a9 9 0 019 9M7 21h10M9 18h6" />
        </svg>
      )
    case 'dance':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
  }
}

export function ProgramSection() {
  return (
    <section
      className="section-program min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-cream-warm lg:bg-transparent"
      role="region"
      aria-label={COUPLE.programTitle}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-3xl md:text-[2.5rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.programTitle}
      </h2>

      <div className="scroll-reveal mt-4 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="mt-10 w-full space-y-8">
        {PROGRAM_EVENTS.map((event) => (
          <div key={event.title} className="scroll-reveal">
            <div className="mx-auto w-fit">
              <ProgramIcon icon={event.icon} />
            </div>
            <p className="mt-3 font-display text-xl md:text-xl text-brown-deep text-center">
              {event.title}
            </p>
            <p className="mt-1 font-sans text-base md:text-base text-brown-medium text-center">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
