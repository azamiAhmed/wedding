import { COUPLE, TIMELINE_EVENTS, type TimelineEvent } from '@/lib/constants'

function ChapterMedallion({ n }: { n: number }) {
  return (
    <div
      className="relative flex items-center justify-center h-12 w-12 rounded-full border border-gold-moroccan/60 bg-cream-warm shadow-[0_4px_14px_-6px_rgba(58,36,52,0.3)]"
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-full border border-gold-moroccan/30" />
      <span className="font-script text-2xl text-brown-deep leading-none translate-y-[1px]">
        {n}
      </span>
    </div>
  )
}

function ChapterCard({ event, n }: { event: TimelineEvent; n: number }) {
  return (
    <div className="relative px-5 py-5 sm:px-6 sm:py-6 border border-gold-moroccan/25 bg-white-broken/75 backdrop-blur-sm rounded-sm shadow-[0_8px_30px_-18px_rgba(58,36,52,0.3)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-mauve-deep">
          Chapitre {String(n).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-gold-moroccan/40" />
      </div>
      <time
        dateTime={event.dateTime}
        className="block font-sans text-xs sm:text-sm tracking-wider uppercase text-brown-medium mb-1"
      >
        {event.date}
      </time>
      <h3 className="font-display text-2xl sm:text-[1.75rem] text-brown-deep leading-tight">
        {event.title}
      </h3>
      <p className="mt-2 font-sans text-sm sm:text-base text-brown-medium leading-relaxed">
        {event.description}
      </p>
    </div>
  )
}

export function StoryV2() {
  return (
    <section
      className="section-timeline min-h-dvh snap-start flex flex-col justify-center bg-cream-warm lg:bg-transparent px-6 lg:px-12 py-16 lg:py-20"
      role="region"
      aria-label={COUPLE.timelineTitle}
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-brown-medium text-center">
        Trois moments
      </p>
      <h2 className="motion-safe:animate-fade-in-up mt-3 font-display text-[2.25rem] md:text-[3.25rem] font-light text-brown-deep text-center leading-tight">
        {COUPLE.timelineTitle}
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="relative mt-10 lg:mt-14 w-full">
        {/* Mobile: medallion left, card right */}
        <div className="md:hidden relative pl-16">
          <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-gold-moroccan/50 to-transparent" />
          {TIMELINE_EVENTS.map((event, i) => (
            <article
              key={event.title}
              className={`scroll-reveal relative ${i < TIMELINE_EVENTS.length - 1 ? 'pb-10' : ''}`}
            >
              <div className="absolute -left-16 top-0">
                <ChapterMedallion n={i + 1} />
              </div>
              <ChapterCard event={event} n={i + 1} />
            </article>
          ))}
        </div>

        {/* Desktop: alternating columns with center spine */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-moroccan/50 to-transparent" />
          {TIMELINE_EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <article
                key={event.title}
                className={`scroll-reveal relative grid grid-cols-[1fr_auto_1fr] gap-8 items-center ${i < TIMELINE_EVENTS.length - 1 ? 'pb-12' : ''}`}
              >
                {isLeft ? <ChapterCard event={event} n={i + 1} /> : <div />}
                <div className="flex justify-center">
                  <ChapterMedallion n={i + 1} />
                </div>
                {!isLeft ? <ChapterCard event={event} n={i + 1} /> : <div />}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
