import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default async function Icon() {
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          borderRadius: '50%',
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle — golden ring */}
          <circle cx="30" cy="30" r="27" stroke="#B8860B" strokeWidth="2" />

          {/* Monogram — A */}
          <path
            d="M18 40 L22.5 22 L27 40 M19.5 35 L25.5 35"
            stroke="#B8860B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Monogram — & */}
          <path
            d="M29 36 C29 34 31 33 31 31 C31 29.5 30 29 29.5 29 C29 29 28 29.5 28 31 C28 32 29 33 30 34 C31 35 32 36 32 37.5 C32 38.5 31 39.5 30 39.5 C29 39.5 28 38.5 28 37"
            stroke="#B8860B"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Monogram — G */}
          <path
            d="M42 27 C40 23 37 22 35 22 C32 22 33 25 33 31 C33 37 32 40 35 40 C37 40 40 39 42 35 L42 31 L38 31"
            stroke="#B8860B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
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
