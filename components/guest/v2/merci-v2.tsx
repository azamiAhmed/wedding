import { COUPLE } from '@/lib/constants'

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

export function MerciV2() {
  return (
    <section
      className="section-merci min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm lg:bg-transparent"
      role="region"
      aria-label="Remerciements"
    >
      <div className="flex flex-col items-center text-center">
        <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.45em] uppercase text-brown-medium">
          Avec gratitude
        </p>

        <h2 className="motion-safe:animate-fade-in-up mt-4 font-script text-6xl sm:text-7xl md:text-[7rem] text-brown-deep leading-none">
          Merci
        </h2>

        <div className="scroll-reveal mt-6">
          <HeartFlourish />
        </div>

        <p className="scroll-reveal mt-6 font-display text-lg sm:text-xl md:text-2xl text-brown-deep leading-relaxed">
          {COUPLE.merciMessage}
        </p>

        <p className="scroll-reveal mt-10 font-sans text-xs tracking-[0.35em] uppercase text-mauve-deep">
          À très bientôt —
        </p>
        <p className="scroll-reveal mt-3 font-script text-4xl sm:text-5xl text-brown-deep leading-none">
          Ghizlaine &amp; Ahmed
        </p>
        <p className="scroll-reveal mt-3 font-display italic text-sm text-brown-medium">
          Casablanca · 02 Octobre 2026
        </p>
      </div>
    </section>
  )
}
