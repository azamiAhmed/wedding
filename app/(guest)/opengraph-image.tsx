import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { COUPLE, OG } from '@/lib/constants'

export const runtime = 'nodejs'
export const alt = OG.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const cormorantFont = readFileSync(
    join(process.cwd(), 'public', 'fonts', 'cormorant-garamond-light.ttf')
  )

  const heroData = readFileSync(join(process.cwd(), 'public', 'images', 'hero.jpg'))
  const heroBase64 = `data:image/jpeg;base64,${heroData.toString('base64')}`

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
          position: 'relative',
        }}
      >
        {/* Hero photo background */}
        <img
          alt=""
          src={heroBase64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Golden overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(44, 36, 24, 0.55)',
            display: 'flex',
          }}
        />

        {/* Gold border accent */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '1.5px solid rgba(184, 134, 11, 0.6)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Invitation text */}
          <p
            style={{
              fontFamily: 'Cormorant',
              fontSize: 26,
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '0.2em',
              marginBottom: 28,
              textTransform: 'uppercase' as const,
            }}
          >
            {COUPLE.inviteText}
          </p>

          {/* Couple names */}
          <h1
            style={{
              fontFamily: 'Cormorant',
              fontSize: 80,
              fontWeight: 300,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {COUPLE.names}
          </h1>

          {/* Gold separator */}
          <div
            style={{
              width: 80,
              height: 2,
              backgroundColor: '#B8860B',
              marginBottom: 20,
              display: 'flex',
            }}
          />

          {/* Date */}
          <p
            style={{
              fontFamily: 'Cormorant',
              fontSize: 34,
              color: '#E8D5A8',
              letterSpacing: '0.1em',
            }}
          >
            {COUPLE.date}
          </p>
        </div>
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
