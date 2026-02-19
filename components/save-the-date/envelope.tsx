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
        {/* Subtle grain texture */}
        <defs>
          <filter id="envelope-grain">
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
        </defs>

        {/* Main body */}
        <rect
          x="1"
          y="1"
          width="178"
          height="118"
          rx="2"
          fill="#FFFDF9"
          stroke="#D4A54A"
          strokeWidth="0.8"
          filter="url(#envelope-grain)"
        />

        {/* Inner fold lines — diagonal creases from top corners to center */}
        <line
          x1="1"
          y1="1"
          x2="90"
          y2="55"
          stroke="#E8D5A8"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <line
          x1="179"
          y1="1"
          x2="90"
          y2="55"
          stroke="#E8D5A8"
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* Bottom fold lines */}
        <line
          x1="1"
          y1="119"
          x2="90"
          y2="65"
          stroke="#E8D5A8"
          strokeWidth="0.3"
          opacity="0.3"
        />
        <line
          x1="179"
          y1="119"
          x2="90"
          y2="65"
          stroke="#E8D5A8"
          strokeWidth="0.3"
          opacity="0.3"
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
          <polygon
            points="1,0 179,0 90,68"
            fill="#FFFDF9"
            stroke="#D4A54A"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Flap fold crease */}
          <line
            x1="1"
            y1="0"
            x2="90"
            y2="68"
            stroke="#E8D5A8"
            strokeWidth="0.3"
            opacity="0.25"
          />
          <line
            x1="179"
            y1="0"
            x2="90"
            y2="68"
            stroke="#E8D5A8"
            strokeWidth="0.3"
            opacity="0.25"
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
