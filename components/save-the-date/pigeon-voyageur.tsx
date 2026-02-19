export function PigeonVoyageur({ className }: { className?: string }) {
  return (
    <div
      className={`pigeon-container pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Ombre portée subtile */}
        <ellipse cx="55" cy="68" rx="18" ry="3" fill="#E8D5A8" opacity="0.25" />

        {/* Queue — plumes effilées */}
        <path
          d="M20 38 Q10 32 5 25 Q12 30 18 34 Q8 28 4 18 Q14 28 20 34"
          fill="#D4A54A"
        />

        {/* Aile arrière — passe sous le corps, opacity réduite */}
        <g className="pigeon-wing-right">
          <path
            d="M35 32 Q25 10 40 5 Q48 8 50 18 Q48 25 42 30 Z"
            fill="#D4A54A"
            opacity="0.6"
          />
        </g>

        {/* Corps principal — forme ovale allongée */}
        <path
          d="M25 30 Q30 20 45 22 Q60 24 68 32 Q72 38 68 44 Q60 50 45 48 Q30 46 25 38 Z"
          fill="#B8860B"
        />

        {/* Poitrine — nuance plus claire */}
        <path
          d="M40 32 Q50 28 58 33 Q60 38 55 42 Q48 44 42 40 Z"
          fill="#D4A54A"
          opacity="0.5"
        />

        {/* Tête */}
        <circle cx="72" cy="28" r="8" fill="#B8860B" />

        {/* Œil */}
        <circle cx="75" cy="26" r="1.5" fill="#FFFDF9" />
        <circle cx="75.5" cy="26" r="0.7" fill="#2C2418" />

        {/* Bec */}
        <path d="M80 28 L88 27 L80 30 Z" fill="#D4A54A" />

        {/* Enveloppe dans le bec — visible dès la frame 1 */}
        <g className="pigeon-envelope">
          <rect
            x="85"
            y="24"
            width="14"
            height="9"
            rx="1"
            fill="#FFFDF9"
            stroke="#D4A54A"
            strokeWidth="0.6"
          />
          {/* Rabat de la petite enveloppe */}
          <path
            d="M85.5 24.5 L92 29 L98.5 24.5"
            stroke="#E8D5A8"
            strokeWidth="0.4"
            fill="none"
          />
        </g>

        {/* Aile avant — aile principale visible */}
        <g className="pigeon-wing-left">
          <path
            d="M38 30 Q30 8 45 2 Q55 5 56 16 Q52 24 46 28 Z"
            fill="#D4A54A"
          />
          {/* Détail plume */}
          <path
            d="M42 18 Q48 10 52 14"
            stroke="#B8860B"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* Pattes repliées (en vol) */}
        <path
          d="M50 48 L52 54 L54 52 M55 48 L57 54 L59 52"
          stroke="#D4A54A"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
