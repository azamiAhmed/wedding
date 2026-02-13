import { COUPLE } from '@/lib/constants'

export function HeroSection({ guestName }: { guestName: string }) {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 bg-brown-deep text-white-broken"
      role="banner"
    >
      <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold-veil mb-4">
        Vous êtes cordialement invité(e)
      </p>
      <h1 className="font-display text-5xl md:text-[5rem] font-light text-gold-moroccan leading-tight text-center">
        {COUPLE.names}
      </h1>
      <p className="font-display text-2xl md:text-4xl text-gold-veil mt-4">
        {COUPLE.date}
      </p>
      <p className="font-sans text-lg text-gold-veil/80 mt-8">
        {COUPLE.greeting(guestName)}
      </p>
    </section>
  )
}
