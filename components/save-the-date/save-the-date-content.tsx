import { SAVE_THE_DATE } from '@/lib/constants'
import { GoldenSeparator } from '@/components/save-the-date/golden-separator'

export function SaveTheDateContent() {
  return (
    <div className="mx-auto text-center">
      <h1 className="font-display text-[clamp(3rem,5vw+1rem,5rem)] font-light text-brown-deep">
        {SAVE_THE_DATE.title}
      </h1>

      <time
        dateTime={SAVE_THE_DATE.dateTime}
        className="mt-8 block font-display text-[clamp(2.25rem,3.5vw+0.75rem,3.5rem)] font-normal text-brown-deep"
      >
        {SAVE_THE_DATE.date}
      </time>

      <address className="mt-4 font-display text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-normal not-italic text-brown-deep">
        {SAVE_THE_DATE.city}
      </address>

      <div className="mt-4">
        <GoldenSeparator />
      </div>

      <blockquote className="mt-4 font-sans text-lg italic text-brown-medium">
        {SAVE_THE_DATE.message}
      </blockquote>
    </div>
  )
}
