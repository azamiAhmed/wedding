import { COUPLE } from '@/lib/constants'

export function MerciSection() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm"
      role="region"
      aria-label="Remerciements"
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-3xl md:text-[3.5rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.merciTitle}
      </h2>

      <div className="scroll-reveal mt-4 mx-auto h-px w-12 bg-gold-moroccan" />

      <p className="scroll-reveal mt-4 font-display text-sm md:text-lg text-brown-deep text-center leading-relaxed">
        {COUPLE.merciMessage}
      </p>
    </section>
  )
}
