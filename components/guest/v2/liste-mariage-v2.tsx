import { COUPLE, LISTE_MARIAGE } from '@/lib/constants'
import { RibCard } from './rib-card'

function HeartFlourish() {
  return (
    <svg
      viewBox="0 0 100 24"
      className="h-5 w-32 text-gold-moroccan v2-ornament"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
    >
      <path d="M2 12 Q20 4 35 12 T68 12" opacity="0.7" />
      <path
        d="M50 16 C46 12, 42 13, 42 17 C42 20, 50 22, 50 22 C50 22, 58 20, 58 17 C58 13, 54 12, 50 16 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M65 12 Q80 4 98 12" opacity="0.7" />
    </svg>
  )
}

function GiftIcon() {
  return (
    <svg
      className="h-6 w-6 text-gold-moroccan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7S11 3 8.5 3 6 5 6 5s.5 2 3 2M12 7s1-4 3.5-4S18 5 18 5s-.5 2-3 2" />
    </svg>
  )
}

export function ListeMariageV2() {
  const hasLink = LISTE_MARIAGE.cagnotteUrl !== '#'

  return (
    <section
      className="section-liste min-h-dvh snap-start flex flex-col justify-center py-12 lg:py-24 px-6 lg:px-12 bg-transparent"
      role="region"
      aria-label={LISTE_MARIAGE.title}
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-brown-medium text-center">
        {LISTE_MARIAGE.eyebrow}
      </p>
      <h2 className="motion-safe:animate-fade-in-up mt-3 font-display text-[2rem] md:text-[2.75rem] font-light text-brown-deep text-center leading-tight">
        {LISTE_MARIAGE.title}
      </h2>

      <div className="motion-safe:animate-fade-in-up mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="motion-safe:animate-fade-in-up mt-10 w-full">
        <div className="relative px-6 py-10 sm:px-10 sm:py-12 border border-gold-moroccan/30 bg-cream-warm/85 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(58,36,52,0.3)] flex flex-col items-center text-center">
          <GiftIcon />

          <div className="mt-6 space-y-3">
            {LISTE_MARIAGE.intro.map((p, i) => (
              <p key={i} className="font-display text-base sm:text-lg text-brown-deep leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <RibCard />

          {hasLink && (
            <a
              href={LISTE_MARIAGE.cagnotteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-gold-moroccan px-8 py-3 font-sans text-base font-medium text-white-broken transition-colors duration-200 hover:bg-gold-moroccan/90 active:scale-[0.97]"
            >
              {LISTE_MARIAGE.buttonLabel}
            </a>
          )}
        </div>
      </div>

      {/* Clôture — gratitude */}
      <div className="mt-16 flex flex-col items-center text-center">
        <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.45em] uppercase text-brown-medium">
          Avec toute notre gratitude
        </p>
        <h3 className="motion-safe:animate-fade-in-up mt-4 font-script text-5xl sm:text-6xl md:text-[5rem] text-brown-deep leading-none">
          {COUPLE.merciTitle}
        </h3>
        <div className="motion-safe:animate-fade-in-up mt-6">
          <HeartFlourish />
        </div>
        <p className="motion-safe:animate-fade-in-up mt-6 font-display text-lg sm:text-xl text-brown-deep leading-relaxed">
          {COUPLE.merciMessage}
        </p>
        <p className="motion-safe:animate-fade-in-up mt-6 font-script text-3xl sm:text-4xl text-brown-deep leading-none">
          {COUPLE.names}
        </p>
        <p className="motion-safe:animate-fade-in-up mt-3 font-display italic text-sm text-brown-medium">
          Casablanca · 02 Octobre 2026
        </p>
      </div>
    </section>
  )
}
