import { COUPLE, TIMELINE_EVENTS, type TimelineEvent } from '@/lib/constants'

function EventCard({
  event,
  titleSize,
  className,
}: {
  event: TimelineEvent
  titleSize: string
  className?: string
}) {
  return (
    <div className={className}>
      <time
        dateTime={event.dateTime}
        className="block font-sans text-base text-brown-medium uppercase tracking-wider mb-1"
      >
        {event.date}
      </time>
      <h3 className={`font-display ${titleSize} text-brown-deep mb-2`}>
        {event.title}
      </h3>
      <p className="font-sans text-lg text-brown-medium leading-relaxed">
        {event.description}
      </p>
    </div>
  )
}

export function TimelineSection() {
  return (
    <section
      className="section-timeline min-h-dvh snap-start flex flex-col justify-center bg-cream-warm lg:bg-transparent px-6 lg:px-12 py-16 lg:py-20"
      role="region"
      aria-label={COUPLE.timelineTitle}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-[2.5rem] md:text-[3.5rem] text-brown-deep text-center leading-tight mb-12 md:mb-16">
        {COUPLE.timelineTitle}
      </h2>

      <div className="relative w-full">
        {/* Mobile layout: line left, cards right */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gold-moroccan" />

          {TIMELINE_EVENTS.map((event, i) => (
            <article
              key={event.title}
              className={`scroll-reveal relative ${i < TIMELINE_EVENTS.length - 1 ? 'pb-12' : ''}`}
            >
              <div className="absolute -left-8 top-1.5 h-4 w-4 rounded-full bg-gold-moroccan border-2 border-cream-warm" />
              <EventCard event={event} titleSize="text-2xl" />
            </article>
          ))}
        </div>

        {/* Desktop layout: centered line, alternating sides */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-2 bottom-2 w-0.5 -translate-x-1/2 bg-gold-moroccan" />

          {TIMELINE_EVENTS.map((event, i) => {
            const isLeft = i % 2 === 0

            return (
              <article
                key={event.title}
                className={`scroll-reveal relative grid grid-cols-[1fr_auto_1fr] gap-8 items-start ${i < TIMELINE_EVENTS.length - 1 ? 'pb-16' : ''}`}
              >
                {isLeft ? (
                  <EventCard
                    event={event}
                    titleSize="text-2xl"
                    className="text-right"
                  />
                ) : (
                  <div />
                )}

                <div className="flex justify-center">
                  <div className="h-4 w-4 rounded-full bg-gold-moroccan border-2 border-cream-warm mt-1.5" />
                </div>

                {!isLeft ? (
                  <EventCard event={event} titleSize="text-2xl" />
                ) : (
                  <div />
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
