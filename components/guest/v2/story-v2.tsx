import Image from 'next/image'
import { STORY } from '@/lib/constants'

function StoryPhoto() {
  return (
    <div className="rotate-[-2deg] bg-white-broken p-3 pb-10 shadow-[0_18px_44px_-18px_rgba(52,39,31,0.45)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
        <Image
          src="/personal/couple-3.jpg"
          alt="Ghizlaine et Ahmed"
          fill
          sizes="(max-width: 1024px) 60vw, 28vw"
          className="object-cover"
        />
      </div>
      <p className="mt-2.5 text-center font-script text-xl text-ink">{STORY.photoCaption}</p>
    </div>
  )
}

export function StoryV2() {
  return (
    <section
      className="section-timeline min-h-dvh snap-start flex flex-col justify-center bg-transparent px-6 lg:px-12 py-10 lg:py-20"
      role="region"
      aria-label={STORY.title}
    >
      <h2 className="motion-safe:animate-fade-in-up font-display text-[2.25rem] md:text-[3.25rem] font-light text-brown-deep text-center leading-tight">
        {STORY.title}
      </h2>

      <div className="motion-safe:animate-fade-in-up mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <div className="mt-10 lg:mt-14 grid w-full gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="motion-safe:animate-fade-in-up mx-auto w-60 sm:w-72">
          <StoryPhoto />
        </div>

        <div className="space-y-4">
          {STORY.paragraphs.map((p, i) => (
            <p
              key={i}
              className="motion-safe:animate-fade-in-up w-full font-display text-base sm:text-lg text-brown-deep leading-relaxed text-center lg:text-left"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
