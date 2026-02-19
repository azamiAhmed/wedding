import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { SAVE_THE_DATE_OG } from '@/lib/constants'

export const runtime = 'nodejs'
export const alt = SAVE_THE_DATE_OG.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const cormorantFont = readFileSync(
    join(process.cwd(), 'public', 'fonts', 'cormorant-garamond-light.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          position: 'relative',
        }}
      >
        {/* Envelope + Seal — centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Envelope SVG — simplified (no filter/defs) */}
          <svg
            width="360"
            height="240"
            viewBox="0 0 180 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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

            {/* Flap — closed triangular flap on top */}
            <polygon
              points="1,0 179,0 90,68"
              fill="#FFFDF9"
              stroke="#D4A54A"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            {/* Flap fold creases */}
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

          {/* Seal A&G — positioned on top of envelope center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer circle — golden ring */}
              <circle cx="30" cy="30" r="28" stroke="#B8860B" strokeWidth="1.2" />

              {/* Inner circle — opacity +0.1 vs seal-ag.tsx for OG visibility */}
              <circle
                cx="30"
                cy="30"
                r="22"
                stroke="#D4A54A"
                strokeWidth="0.6"
                opacity="0.6"
              />

              {/* Cardinal lines */}
              <line x1="30" y1="2" x2="30" y2="8" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="30" y1="52" x2="30" y2="58" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="2" y1="30" x2="8" y2="30" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="52" y1="30" x2="58" y2="30" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />

              {/* Diagonal lines */}
              <line x1="9.8" y1="9.8" x2="13.6" y2="13.6" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="50.2" y1="9.8" x2="46.4" y2="13.6" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="9.8" y1="50.2" x2="13.6" y2="46.4" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />
              <line x1="50.2" y1="50.2" x2="46.4" y2="46.4" stroke="#D4A54A" strokeWidth="0.6" opacity="0.8" />

              {/* Cardinal diamond motifs only — diagonal motifs omitted to reduce noise at 1200×630 */}
              <path d="M30 2 L33 8 L30 10 L27 8 Z" stroke="#D4A54A" strokeWidth="0.5" opacity="0.7" />
              <path d="M30 58 L33 52 L30 50 L27 52 Z" stroke="#D4A54A" strokeWidth="0.5" opacity="0.7" />
              <path d="M2 30 L8 27 L10 30 L8 33 Z" stroke="#D4A54A" strokeWidth="0.5" opacity="0.7" />
              <path d="M58 30 L52 27 L50 30 L52 33 Z" stroke="#D4A54A" strokeWidth="0.5" opacity="0.7" />

              {/* Monogram — A & G */}
              <path
                d="M18 40 L22.5 22 L27 40 M19.5 35 L25.5 35"
                stroke="#B8860B"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M29 36 C29 34 31 33 31 31 C31 29.5 30 29 29.5 29 C29 29 28 29.5 28 31 C28 32 29 33 30 34 C31 35 32 36 32 37.5 C32 38.5 31 39.5 30 39.5 C29 39.5 28 38.5 28 37"
                stroke="#B8860B"
                strokeWidth="0.9"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M42 27 C40 23 37 22 35 22 C32 22 33 25 33 31 C33 37 32 40 35 40 C37 40 40 39 42 35 L42 31 L38 31"
                stroke="#B8860B"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Text below envelope */}
        <p
          style={{
            fontFamily: 'Cormorant',
            fontSize: 36,
            fontWeight: 300,
            color: '#2C2418',
            marginTop: 40,
            letterSpacing: '0.05em',
          }}
        >
          Save the Date
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cormorant',
          data: cormorantFont,
          style: 'normal',
          weight: 300,
        },
      ],
    }
  )
}
