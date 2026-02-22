import { COUPLE } from '@/lib/constants'

export function HeroSection({ guestName }: { guestName: string }) {
  return (
    <section
      className="relative min-h-dvh snap-start overflow-hidden"
      role="banner"
      aria-label="Accueil"
    >
      {/* Background video — mobile version */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover lg:hidden"
      >
        <source src="/images/mobile-invitation-bg.mp4" type="video/mp4" />
      </video>
      {/* Background video — desktop version */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover hidden lg:block"
      >
        <source src="/images/invitation-bg.mp4" type="video/mp4" />
      </video>

      {/* Light overlay for text readability */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="motion-safe:animate-fade-in-up font-sans text-sm tracking-[0.3em] uppercase text-brown-medium mb-4">
          {COUPLE.inviteText}
        </p>
        <h1 className="motion-safe:animate-fade-in-up font-display text-5xl md:text-[5rem] font-light text-brown-deep leading-tight">
          {COUPLE.names}
        </h1>
        <p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:100ms] font-display text-2xl md:text-4xl text-mauve-deep mt-4">
          {COUPLE.date}
        </p>
        <p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:200ms] font-sans text-lg text-brown-medium mt-8">
          {COUPLE.greeting(guestName)}
        </p>
      </div>
    </section>
  )
}
