import { HOTELS, METEO } from '@/lib/constants'

export function DetailsV2() {
  return (
    <section
      className="section-details min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-transparent"
      role="region"
      aria-label="Informations pratiques"
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-brown-medium text-center">
        Tout ce qu&apos;il faut savoir
      </p>
      <h2 className="motion-safe:animate-fade-in-up mt-3 font-display text-[2rem] md:text-[2.75rem] font-light text-brown-deep text-center leading-tight">
        Informations pratiques
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="scroll-reveal mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Tenue */}
        <div className="relative px-6 py-7 border border-gold-moroccan/25 bg-cream-warm/85 backdrop-blur-sm shadow-[0_8px_30px_-18px_rgba(58,36,52,0.3)]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-5 w-5 text-gold-moroccan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 3l4 4 4-4M6 8h12l-2 13H8L6 8z" />
            </svg>
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
              Tenue
            </span>
          </div>
          <p className="font-display text-xl sm:text-2xl text-brown-deep">Chic &amp; coloré</p>
          <p className="mt-2 font-sans text-sm sm:text-base text-brown-medium leading-relaxed">
            Toutes les couleurs sont les bienvenues : caftans ou robes longues pour les
            femmes et costumes pour les hommes seront parfaits pour célébrer cette belle
            soirée. Venez sur votre 31, avec votre plus beau sourire, pour faire briller
            cette soirée à nos côtés.
          </p>
        </div>

        {/* Ambiance */}
        <div className="relative px-6 py-7 border border-gold-moroccan/25 bg-cream-warm/85 backdrop-blur-sm shadow-[0_8px_30px_-18px_rgba(58,36,52,0.3)]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-5 w-5 text-gold-moroccan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
              Ambiance
            </span>
          </div>
          <p className="font-display text-xl sm:text-2xl text-brown-deep">Danse, joie, partage</p>
          <p className="mt-2 font-sans text-sm sm:text-base text-brown-medium leading-relaxed">
            Une fête marocaine sous les étoiles de Casablanca. Venez le cœur léger et les
            chaussures de danse aux pieds.
          </p>
        </div>
      </div>

      {/* Hôtels & Météo */}
      <div className="scroll-reveal mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Hébergements */}
        <div className="relative px-6 py-7 border border-gold-moroccan/25 bg-cream-warm/85 backdrop-blur-sm shadow-[0_8px_30px_-18px_rgba(58,36,52,0.3)]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-5 w-5 text-gold-moroccan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18v2M21 18v2M3 14h18M7 10V8a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
              Hébergements
            </span>
          </div>
          <ul className="space-y-3">
            {HOTELS.map((hotel) => (
              <li key={hotel.name} className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg text-brown-deep">
                  {hotel.url ? (
                    <a
                      href={hotel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-gold-moroccan/40 underline-offset-4 transition-colors hover:text-mauve-deep"
                    >
                      {hotel.name}
                    </a>
                  ) : (
                    hotel.name
                  )}
                </span>
                <span className="font-sans text-sm text-brown-medium">{hotel.area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Météo */}
        <div className="relative px-6 py-7 border border-gold-moroccan/25 bg-cream-warm/85 backdrop-blur-sm shadow-[0_8px_30px_-18px_rgba(58,36,52,0.3)]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-5 w-5 text-gold-moroccan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
              {METEO.label}
            </span>
          </div>
          <p className="font-display text-xl sm:text-2xl text-brown-deep">{METEO.title}</p>
          <p className="mt-2 font-sans text-sm sm:text-base text-brown-medium leading-relaxed">
            {METEO.text}
          </p>
        </div>
      </div>
    </section>
  )
}
