export function SealAG({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle — golden ring */}
      <circle cx="30" cy="30" r="28" stroke="#B8860B" strokeWidth="1.2" />

      {/* Inner circle — subtle frame for the monogram */}
      <circle cx="30" cy="30" r="22" stroke="#D4A54A" strokeWidth="0.6" opacity="0.5" />

      {/* 8-fold arabesque entrelacs — geometric star pattern between the two circles */}
      {/* Cardinal points — vertical and horizontal lines */}
      <line x1="30" y1="2" x2="30" y2="8" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="30" y1="52" x2="30" y2="58" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="2" y1="30" x2="8" y2="30" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="52" y1="30" x2="58" y2="30" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />

      {/* Diagonal points — 45-degree lines */}
      <line x1="9.8" y1="9.8" x2="13.6" y2="13.6" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="50.2" y1="9.8" x2="46.4" y2="13.6" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="9.8" y1="50.2" x2="13.6" y2="46.4" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />
      <line x1="50.2" y1="50.2" x2="46.4" y2="46.4" stroke="#D4A54A" strokeWidth="0.6" opacity="0.7" />

      {/* 8-pointed star — interlacing arcs between circles */}
      <path
        d="M30 2 L33 8 L30 10 L27 8 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M30 58 L33 52 L30 50 L27 52 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M2 30 L8 27 L10 30 L8 33 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M58 30 L52 27 L50 30 L52 33 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Diagonal diamond motifs */}
      <path
        d="M9.8 9.8 L13 7.5 L14.5 11 L11 13 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <path
        d="M50.2 9.8 L47 7.5 L45.5 11 L49 13 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <path
        d="M9.8 50.2 L13 52.5 L14.5 49 L11 47 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <path
        d="M50.2 50.2 L47 52.5 L45.5 49 L49 47 Z"
        stroke="#D4A54A"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Monogram — "A & G" in elegant serif paths */}
      {/* Letter A */}
      <path
        d="M18 40 L22.5 22 L27 40 M19.5 35 L25.5 35"
        stroke="#B8860B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ampersand — smaller, centered */}
      <path
        d="M29 36 C29 34 31 33 31 31 C31 29.5 30 29 29.5 29 C29 29 28 29.5 28 31 C28 32 29 33 30 34 C31 35 32 36 32 37.5 C32 38.5 31 39.5 30 39.5 C29 39.5 28 38.5 28 37"
        stroke="#B8860B"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Letter G */}
      <path
        d="M42 27 C40 23 37 22 35 22 C32 22 33 25 33 31 C33 37 32 40 35 40 C37 40 40 39 42 35 L42 31 L38 31"
        stroke="#B8860B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
