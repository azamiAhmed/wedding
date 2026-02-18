import type { Metadata } from 'next'
import { SAVE_THE_DATE } from '@/lib/constants'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8">
      <div className="mx-auto text-center">
        <h1 className="font-display text-5xl font-light text-brown-deep lg:text-[5rem]">
          {SAVE_THE_DATE.title}
        </h1>

        <time
          dateTime={SAVE_THE_DATE.dateTime}
          className="mt-8 block font-display text-4xl font-normal text-brown-deep lg:text-[3.5rem]"
        >
          {SAVE_THE_DATE.date}
        </time>

        <address className="mt-4 font-display text-[1.75rem] font-normal not-italic text-brown-deep lg:text-[2.5rem]">
          {SAVE_THE_DATE.city}
        </address>

        <div aria-hidden="true" className="mx-auto mt-4 h-px w-12 bg-gold-moroccan" />

        <blockquote className="mt-4 font-sans text-lg italic text-brown-medium">
          {SAVE_THE_DATE.message}
        </blockquote>
      </div>
    </main>
  )
}
