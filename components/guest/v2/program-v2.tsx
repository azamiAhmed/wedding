import { COUPLE, PROGRAM_EVENTS, type ProgramEvent } from '@/lib/constants'

const TIMES: Record<ProgramEvent['icon'], string> = {
  welcome: '15h30',
  ceremony: '16h00',
  cocktail: '18h00',
  dinner: '20h00',
  dance: '22h00',
}

function ProgramIcon({ icon }: { icon: ProgramEvent['icon'] }) {
  const className = 'h-6 w-6 text-gold-moroccan'
  switch (icon) {
    case 'welcome':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11l-2-2v12a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
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
          <path d="M5 3h14L12 12 5 3zM12 12v8M8 21h8" />
        </svg>
      )
    case 'dinner':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 3v8a3 3 0 003 3v7M7 3v8M10 3v8M17 3c-1.5 0-2 1.5-2 4s0.5 4 2 4 2-1.5 2-4-0.5-4-2-4zM17 14v7" />
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

export function ProgramV2() {
  return (
    <section
      className="section-program min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-transparent"
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

      <p className="motion-safe:animate-fade-in-up mt-3 font-sans text-xs italic text-brown-medium text-center">
        (Horaires à confirmer)
      </p>

      <div className="relative mt-10 w-full">
        {/* Center vertical line */}
        <div className="absolute left-[26px] sm:left-1/2 top-3 bottom-3 w-px sm:-translate-x-1/2 bg-gradient-to-b from-transparent via-gold-moroccan/40 to-transparent" />

        <ol className="space-y-7 sm:space-y-9">
          {PROGRAM_EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <li
                key={event.title}
                className="scroll-reveal relative pl-16 sm:pl-0 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6"
              >
                {/* Mobile peg + Desktop left side */}
                <div className={`sm:contents`}>
                  {/* Left content (desktop only) */}
                  <div className={`hidden sm:block ${isLeft ? '' : 'sm:order-3'} text-right ${!isLeft ? 'sm:text-left' : ''}`}>
                    {isLeft ? (
                      <>
                        <p className="font-display text-lg text-brown-deep">{event.title}</p>
                        <p className="font-sans text-sm text-brown-medium">{event.description}</p>
                      </>
                    ) : (
                      <p className="font-script text-2xl text-mauve-deep">{TIMES[event.icon]}</p>
                    )}
                  </div>

                  {/* Peg / Icon */}
                  <div className="absolute left-0 top-0 sm:static sm:flex sm:justify-center sm:order-2">
                    <div className="relative flex items-center justify-center h-[52px] w-[52px] rounded-full border border-gold-moroccan/50 bg-white-broken shadow-[0_4px_14px_-6px_rgba(58,36,52,0.3)]">
                      <span className="absolute inset-1 rounded-full border border-gold-moroccan/20" />
                      <ProgramIcon icon={event.icon} />
                    </div>
                  </div>

                  {/* Right content (desktop) */}
                  <div className={`hidden sm:block ${isLeft ? 'sm:order-3' : ''} text-left ${isLeft ? '' : 'sm:text-right'}`}>
                    {isLeft ? (
                      <p className="font-script text-2xl text-mauve-deep">{TIMES[event.icon]}</p>
                    ) : (
                      <>
                        <p className="font-display text-lg text-brown-deep">{event.title}</p>
                        <p className="font-sans text-sm text-brown-medium">{event.description}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile content */}
                <div className="sm:hidden">
                  <p className="font-script text-xl text-mauve-deep leading-none">
                    {TIMES[event.icon]}
                  </p>
                  <p className="mt-1 font-display text-lg text-brown-deep">{event.title}</p>
                  <p className="font-sans text-sm text-brown-medium">{event.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
