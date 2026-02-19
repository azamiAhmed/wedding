import { SealAG } from '@/components/save-the-date/seal-ag'

export function Envelope({ className }: { className?: string }) {
  return (
    <div
      className={`envelope-container relative ${className ?? ''}`}
      aria-hidden="true"
    >
      {/* Envelope body */}
      <svg
        viewBox="0 0 180 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="envelope-body h-full w-full"
      >
        {/* Subtle grain texture + shadow */}
        <defs>
          <filter id="envelope-grain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="1"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="gray"
            />
            <feBlend in="SourceGraphic" in2="gray" mode="soft-light" />
          </filter>
          <filter id="envelope-shadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#B8960B" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Main body — rounded corners */}
        <rect
          x="1"
          y="1"
          width="178"
          height="118"
          rx="8"
          ry="8"
          fill="#FFFDF9"
          stroke="#D4A54A"
          strokeWidth="0.8"
          filter="url(#envelope-shadow)"
        />
        {/* Paper texture overlay */}
        <rect
          x="1"
          y="1"
          width="178"
          height="118"
          rx="8"
          ry="8"
          fill="#FFFDF9"
          filter="url(#envelope-grain)"
        />

        {/* Inner fold lines — diagonal creases from top corners to center */}
        <line
          x1="8"
          y1="4"
          x2="90"
          y2="55"
          stroke="#E8D5A8"
          strokeWidth="0.5"
          opacity="0.35"
          strokeLinecap="round"
        />
        <line
          x1="172"
          y1="4"
          x2="90"
          y2="55"
          stroke="#E8D5A8"
          strokeWidth="0.5"
          opacity="0.35"
          strokeLinecap="round"
        />

        {/* Bottom fold lines */}
        <line
          x1="8"
          y1="116"
          x2="90"
          y2="65"
          stroke="#E8D5A8"
          strokeWidth="0.3"
          opacity="0.25"
          strokeLinecap="round"
        />
        <line
          x1="172"
          y1="116"
          x2="90"
          y2="65"
          stroke="#E8D5A8"
          strokeWidth="0.3"
          opacity="0.25"
          strokeLinecap="round"
        />

        {/* Subtle inner border for depth */}
        <rect
          x="5"
          y="5"
          width="170"
          height="110"
          rx="5"
          ry="5"
          fill="none"
          stroke="#E8D5A8"
          strokeWidth="0.3"
          opacity="0.2"
        />
      </svg>

      {/* Flap — positioned at top, separate element for rotateX animation */}
      <div className="envelope-flap absolute inset-x-0 top-0 h-[58%]">
        <svg
          viewBox="0 0 180 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Flap with rounded top corners via path */}
          <path
            d="M8,0 L172,0 Q179,0 179,4 L90,68 L1,4 Q1,0 8,0 Z"
            fill="#FFFDF9"
            stroke="#D4A54A"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Flap fold crease */}
          <line
            x1="8"
            y1="1"
            x2="90"
            y2="68"
            stroke="#E8D5A8"
            strokeWidth="0.3"
            opacity="0.2"
            strokeLinecap="round"
          />
          <line
            x1="172"
            y1="1"
            x2="90"
            y2="68"
            stroke="#E8D5A8"
            strokeWidth="0.3"
            opacity="0.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Seal A&G — centered at closure point */}
      <div className="envelope-seal absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <SealAG className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
      </div>
    </div>
  )
}
