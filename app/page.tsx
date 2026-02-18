import type { Metadata } from 'next'
import { LANDING } from '@/lib/constants'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 sm:px-8">
      <div className="mx-auto text-center">
        <h1 className="font-display text-4xl font-light text-brown-deep sm:text-5xl">
          {LANDING.title}
        </h1>

        <div className="mx-auto mt-8 h-px w-12 bg-gold-moroccan" />

        <p className="mt-8 font-sans text-lg text-brown-medium">
          {LANDING.message}
        </p>
      </div>
    </div>
  )
}
