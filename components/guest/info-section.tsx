import { COUPLE } from '@/lib/constants'

export function InfoSection() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 bg-cream-warm"
      role="region"
      aria-label="Informations"
    >
      <h2 className="font-display text-4xl md:text-[3.5rem] text-brown-deep text-center leading-tight">
        Nous nous marions
      </h2>
      <div className="mt-8 max-w-md text-center space-y-4">
        <p className="font-sans text-lg text-brown-deep">
          {COUPLE.message}
        </p>
        <p className="font-sans text-base text-brown-medium">
          {COUPLE.submessage}
        </p>
      </div>
    </section>
  )
}
