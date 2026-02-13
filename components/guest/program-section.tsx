import { COUPLE, PROGRAM_EVENTS, type ProgramEvent } from '@/lib/constants'

function ProgramIcon({
  icon,
}: {
  icon: ProgramEvent['icon']
}) {
  const className = 'h-6 w-6 text-gold-moroccan'

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
      className="min-h-dvh snap-start flex flex-col justify-center px-6 py-16 bg-cream-warm"
      role="region"
      aria-label={COUPLE.programTitle}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-2xl md:text-[2.5rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.programTitle}
      </h2>

      <div className="mt-4 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="mt-8 mx-auto w-full max-w-sm space-y-5">
        {PROGRAM_EVENTS.map((event) => (
          <article key={event.title} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <ProgramIcon icon={event.icon} />
            </div>
            <div>
              <h3 className="font-display text-sm md:text-base text-brown-deep">
                {event.title}
              </h3>
              <p className="font-sans text-xs text-brown-medium">
                {event.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
