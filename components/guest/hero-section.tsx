import Image from 'next/image'
import { COUPLE } from '@/lib/constants'

export function HeroSection({ guestName }: { guestName: string }) {
  return (
    <section
      className="relative min-h-dvh snap-start overflow-hidden"
      role="banner"
      aria-label="Accueil"
    >
      {/* Background photo */}
      <Image
        src="/images/hero.jpg"
        alt="Ahmed et Ghizlaine"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gold-moroccan/[0.18]" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="motion-safe:animate-fade-in-up font-sans text-sm tracking-[0.3em] uppercase text-white/70 mb-4">
          {COUPLE.inviteText}
        </p>
        <h1 className="motion-safe:animate-fade-in-up font-display text-5xl md:text-[5rem] font-light text-white leading-tight">
          {COUPLE.names}
        </h1>
        <p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:100ms] font-display text-2xl md:text-4xl text-white/90 mt-4">
          {COUPLE.date}
        </p>
        <p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:200ms] font-sans text-lg text-white/80 mt-8">
          {COUPLE.greeting(guestName)}
        </p>
      </div>
    </section>
  )
}
