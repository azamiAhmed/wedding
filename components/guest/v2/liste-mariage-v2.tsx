import { LISTE_MARIAGE } from '@/lib/constants'

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
      className="section-liste min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-cream-warm lg:bg-transparent"
      role="region"
      aria-label={LISTE_MARIAGE.title}
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-brown-medium text-center">
        {LISTE_MARIAGE.eyebrow}
      </p>
      <h2 className="motion-safe:animate-fade-in-up mt-3 font-display text-[2rem] md:text-[2.75rem] font-light text-brown-deep text-center leading-tight">
        {LISTE_MARIAGE.title}
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="scroll-reveal mt-10 w-full">
        <div className="relative px-6 py-10 sm:px-10 sm:py-12 border border-gold-moroccan/30 bg-cream-warm/85 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(58,36,52,0.3)] flex flex-col items-center text-center">
          <GiftIcon />

          <p className="mt-6 mx-auto font-display text-base sm:text-lg text-brown-deep leading-relaxed">
            {LISTE_MARIAGE.intro}
          </p>

          <a
            href={LISTE_MARIAGE.cagnotteUrl}
            {...(hasLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-disabled={!hasLink}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-gold-moroccan px-8 py-3 font-sans text-base font-medium text-white-broken transition-colors duration-200 hover:bg-gold-moroccan/90 active:scale-[0.97]"
          >
            {LISTE_MARIAGE.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
