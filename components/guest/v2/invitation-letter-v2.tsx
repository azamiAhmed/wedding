import { COUPLE } from '@/lib/constants'

function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`text-gold-moroccan ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
    >
      <path d="M2 18 V2 H18" opacity="0.85" />
      <path d="M2 12 Q10 12 12 2" opacity="0.55" />
      <circle cx="2" cy="2" r="1.4" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

export function InvitationLetterV2({ guestName }: { guestName: string }) {
  return (
    <section
      className="section-info min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm lg:bg-transparent"
      role="region"
      aria-label="Invitation"
    >
      <div className="motion-safe:animate-fade-in-up mx-auto relative w-full max-w-none">
        <div className="relative px-6 py-10 sm:px-10 sm:py-14 border border-gold-moroccan/30 bg-white-broken/80 backdrop-blur-sm shadow-[0_10px_50px_-20px_rgba(58,36,52,0.25)]">
          {/* Inner thin border */}
          <div className="absolute inset-3 border border-gold-moroccan/15 pointer-events-none" />

          {/* Corner ornaments */}
          <CornerOrnament className="absolute top-1 left-1 h-6 w-6" />
          <CornerOrnament className="absolute top-1 right-1 h-6 w-6 -scale-x-100" />
          <CornerOrnament className="absolute bottom-1 left-1 h-6 w-6 -scale-y-100" />
          <CornerOrnament className="absolute bottom-1 right-1 h-6 w-6 -scale-100" />

          <div className="relative flex flex-col items-center text-center">
            <p className="font-sans text-[10px] sm:text-xs tracking-[0.45em] uppercase text-brown-medium">
              Carte d&apos;invitation
            </p>

            <div className="scroll-reveal mt-4 h-px w-12 bg-gold-moroccan" />

            <h2 className="scroll-reveal mt-6 font-display text-3xl sm:text-4xl md:text-[2.75rem] font-light text-brown-deep leading-tight">
              {COUPLE.infoTitle}
            </h2>

            <p className="scroll-reveal mt-6 font-display italic text-lg sm:text-xl text-mauve-deep">
              Cher / Chère{' '}
              <span className="font-script not-italic text-2xl sm:text-3xl text-brown-deep">
                {guestName}
              </span>
            </p>

            <p className="scroll-reveal mt-6 font-display text-base sm:text-lg text-brown-deep leading-relaxed">
              {COUPLE.message}
            </p>
            <p className="scroll-reveal mt-3 font-sans text-sm italic text-brown-medium leading-relaxed">
              {COUPLE.submessage}
            </p>

            <div className="scroll-reveal mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-gold-moroccan/60" />
              <span className="font-script text-2xl sm:text-3xl text-brown-deep">
                Ghizlaine &amp; Ahmed
              </span>
              <span className="h-px w-8 bg-gold-moroccan/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
