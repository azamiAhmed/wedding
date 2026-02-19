import { SAVE_THE_DATE } from '@/lib/constants'
import { GoldenSeparator } from '@/components/save-the-date/golden-separator'

export function SaveTheDateContent() {
  return (
    <div className="relative z-20 mx-auto text-center">
      <h1 className="text-line-1 font-display font-light text-brown-deep">
        <span className="block text-[clamp(2.25rem,6vw+0.25rem,3.5rem)]">
          {SAVE_THE_DATE.bride}
        </span>
        <span className="block text-[clamp(1.5rem,3vw+0.25rem,2.25rem)] text-gold-moroccan">
          &amp;
        </span>
        <span className="block text-[clamp(2.25rem,6vw+0.25rem,3.5rem)]">
          {SAVE_THE_DATE.groom}
        </span>
      </h1>

      <time
        dateTime={SAVE_THE_DATE.dateTime}
        className="text-line-2 mt-6 block font-display text-[clamp(1.75rem,4vw+0.25rem,2.75rem)] font-normal text-mauve-deep"
      >
        {SAVE_THE_DATE.date}
      </time>

      <address className="text-line-3 mt-3 font-display text-[clamp(1.5rem,3vw+0.25rem,2.25rem)] font-normal not-italic text-olive-deep">
        {SAVE_THE_DATE.city}
      </address>

      <div className="text-line-4 mt-4">
        <GoldenSeparator />
      </div>

      <blockquote className="text-line-5 mx-auto mt-4 px-4 font-sans text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] leading-relaxed italic text-mauve-soft sm:px-8">
        {SAVE_THE_DATE.message}
      </blockquote>
    </div>
  )
}
