import { COUPLE } from '@/lib/constants'

export function InfoSection() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 bg-cream-warm"
      role="region"
      aria-label="Informations"
    >
      <h2 className="w-full font-display text-5xl md:text-[4.5rem] font-light text-brown-deep text-center leading-tight">
        Nous nous marions
      </h2>

      {/* Séparateur doré */}
      <div className="mt-6 h-px w-16 bg-gold-moroccan" />

      <div className="mt-6 w-full max-w-md text-center space-y-6">
        <p className="font-display text-xl md:text-2xl text-brown-deep leading-relaxed">
          {COUPLE.message}
        </p>
        <p className="font-sans text-base italic text-brown-medium leading-relaxed">
          {COUPLE.submessage}
        </p>
      </div>
    </section>
  )
}
