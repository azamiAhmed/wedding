import { COUPLE, PROGRAM_EVENTS, type ProgramEvent } from '@/lib/constants'

function ProgramIcon({ icon }: { icon: ProgramEvent['icon'] }) {
  const cls = 'h-6 w-6 text-gold-moroccan'
  const common = {
    className: cls,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (icon) {
    case 'welcome':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
        </svg>
      )
    case 'ceremony':
      return (
        <svg {...common}>
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case 'tradition':
      return (
        <svg {...common}>
          <path d="M12 2l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 19.8 6.99 22l1.2-5.6L4 12.6 9.6 12 12 2z" />
        </svg>
      )
    case 'dinner':
      return (
        <svg {...common}>
          <path d="M4 3v8a3 3 0 003 3v7M7 3v8M10 3v8M17 3c-1.5 0-2 1.5-2 4s.5 4 2 4 2-1.5 2-4-.5-4-2-4zM17 14v7" />
        </svg>
      )
    case 'cake':
      return (
        <svg {...common}>
          <path d="M5 21h14M6 21v-7a2 2 0 012-2h8a2 2 0 012 2v7M9 12V9a3 3 0 016 0v3M12 3v3" />
        </svg>
      )
    case 'dance':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
  }
}

export function ProgramV2() {
  return (
    <section
      className="section-program min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-10 lg:py-20 bg-transparent"
      role="region"
      aria-label={COUPLE.programTitle}
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-brown-medium text-center">
        Déroulé de la soirée
      </p>
      <h2 className="motion-safe:animate-fade-in-up mt-3 font-display text-[2rem] md:text-[2.75rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.programTitle}
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <ol className="relative mt-12 w-full space-y-8 sm:space-y-9">
        {/* Vertical spine aligned with the pegs (peg center = 26px) */}
        <div className="pointer-events-none absolute left-[26px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-gold-moroccan/40 to-transparent" />

        {PROGRAM_EVENTS.map((event) => (
          <li key={event.title} className="scroll-reveal relative flex items-start gap-5">
            <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gold-moroccan/50 bg-white-broken shadow-[0_4px_14px_-6px_rgba(58,36,52,0.3)]">
              <span className="absolute inset-1 rounded-full border border-gold-moroccan/20" />
              <ProgramIcon icon={event.icon} />
            </div>
            <div className="flex-1 pt-0.5">
              {event.time && (
                <p className="font-script text-2xl text-mauve-deep leading-none">{event.time}</p>
              )}
              <p className="mt-1 font-display text-lg sm:text-xl text-brown-deep">{event.title}</p>
              <p className="mt-1 font-sans text-sm sm:text-base text-brown-medium leading-relaxed">
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
