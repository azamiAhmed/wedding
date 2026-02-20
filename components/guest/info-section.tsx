import { COUPLE } from '@/lib/constants'

export function InfoSection() {
  return (
    <section
      className="section-info min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm lg:bg-transparent"
      role="region"
      aria-label="Informations"
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-3xl md:text-[3.5rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.infoTitle}
      </h2>

      <div className="scroll-reveal mt-4 mx-auto h-px w-12 bg-gold-moroccan" />

      <p className="scroll-reveal mt-4 font-display text-sm md:text-lg text-brown-deep text-center leading-relaxed">
        {COUPLE.message}
      </p>
      <p className="scroll-reveal mt-2 font-sans text-xs md:text-sm italic text-brown-medium text-center leading-relaxed">
        {COUPLE.submessage}
      </p>
    </section>
  )
}
