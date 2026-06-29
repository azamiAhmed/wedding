'use client'

import Image from 'next/image'
import { COLLAGE } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ANCHOR = {
  mariage: 'notre-mariage',
  programme: 'programme',
  histoire: 'notre-histoire',
  infos: 'infos-pratiques',
} as const

const ARIA: Record<string, string> = {
  mariage: COLLAGE.aria.mariage,
  programme: COLLAGE.aria.programme,
  histoire: COLLAGE.aria.histoire,
  infos: COLLAGE.aria.infos,
  rsvp: COLLAGE.aria.rsvp,
}

const RW = {
  names: { src: '/images/collage/rw-names.png', width: 712, height: 601 },
  envOpen: { src: '/images/collage/rw-env-open.png', width: 614, height: 720 },
  oval: { src: '/images/collage/rw-oval-v3.png', width: 531, height: 720 },
  programme: { src: '/images/collage/rw-programme.png', width: 720, height: 707 },
  flower: { src: '/images/collage/rw-flower.png', width: 685, height: 720 },
  ribbon: { src: '/images/collage/rw-ribbon.png', width: 567, height: 720 },
  hyacL: { src: '/images/collage/rw-hyac-l.png', width: 320, height: 720 },
  hyacR: { src: '/images/collage/rw-hyac-r.png', width: 356, height: 720 },
  details: { src: '/images/collage/rw-details.png', width: 720, height: 379 },
  envRsvp: { src: '/images/collage/rw-env-rsvp.png', width: 720, height: 561 },
  bouquet: { src: '/images/collage/rw-bouquet.png', width: 473, height: 720 },
  champagne: { src: '/images/collage/rw-champagne.png', width: 235, height: 720 },
} as const

/* Portrait stage (mobile-up to lg) — fits within both 90vw and 94dvh */
const STAGE_W = 'min(140vw, calc(96dvh * 597 / 735))'
const STAGE_H = 'calc(min(140vw, calc(96dvh * 597 / 735)) * 735 / 597)'

/* Wide landscape stage (xl) — spreads elements across the width */
const WIDE_H = 'min(90dvh, 820px)'
const WIDE_W = `min(95vw, calc(${WIDE_H} * 1.72))`

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function openRsvp() {
  window.dispatchEvent(new CustomEvent('open-rsvp'))
}

type Asset = { src: string; width: number; height: number }

function AssetImg({ asset, priority = false, alt = '' }: { asset: Asset; priority?: boolean; alt?: string }) {
  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      draggable={false}
      className="pointer-events-none h-auto w-full select-none transition-[filter] duration-300 ease-out drop-shadow-[0_12px_24px_rgba(52,39,31,0.16)] group-hover:drop-shadow-[0_24px_44px_rgba(52,39,31,0.32)]"
    />
  )
}

function Clickable({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group block w-full cursor-pointer rounded-md text-left outline-none',
        'transition-transform duration-300 ease-out',
        'motion-safe:hover:-translate-y-2 focus-visible:-translate-y-1',
        'focus-visible:ring-2 focus-visible:ring-bordeaux/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory'
      )}
    >
      {children}
    </button>
  )
}

function Names() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,_rgba(251,248,242,0.8)_38%,_rgba(251,248,242,0)_70%)]" />
      <AssetImg asset={RW.names} priority alt={`${COLLAGE.bride} & ${COLLAGE.groom}`} />
    </div>
  )
}

function Polaroid() {
  return (
    <div className="rotate-[-3deg] bg-white-broken p-2 pb-8 shadow-[0_16px_34px_-16px_rgba(52,39,31,0.45)] transition-shadow duration-300 group-hover:shadow-[0_26px_50px_-16px_rgba(52,39,31,0.55)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
        <Image
          src="/personal/couple-2.jpg"
          alt="Ghizlaine et Ahmed"
          fill
          draggable={false}
          sizes="(max-width: 1024px) 45vw, 16vw"
          className="pointer-events-none select-none object-cover"
        />
      </div>
    </div>
  )
}

function ScrollHint({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-ink-soft">{COLLAGE.scrollHint}</span>
      <svg viewBox="0 0 12 18" className="v2-scroll-indicator h-4 w-3 text-bordeaux/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M6 1 V15 M1 10 L6 16 L11 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Spot({
  top,
  left,
  width,
  z = 20,
  delay = 0,
  domId,
  children,
}: {
  top: number
  left: number
  width: string
  z?: number
  delay?: number
  domId?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-id={domId}
      className="collage-enter collage-spot absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width,
        transform: 'translate(-50%, -50%)',
        zIndex: z,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* Element kinds: 'names' | 'polaroid' | asset key. action → clickable anchor. */
type Item = {
  id: string
  el: 'names' | 'polaroid' | keyof typeof RW
  action?: keyof typeof ANCHOR | 'rsvp'
  top: number
  left: number
  w: number
  z?: number
  delay?: number
  priority?: boolean
}

function renderInner(it: Item) {
  if (it.el === 'names') return <Names />
  if (it.el === 'polaroid') return <Polaroid />
  return <AssetImg asset={RW[it.el]} priority={it.priority} />
}

function CollageStage({
  className,
  width,
  height,
  items,
  namesScale = 1.65,
  bgOpacity = 1,
}: {
  className: string
  width: string
  height: string
  items: Item[]
  namesScale?: number
  bgOpacity?: number
}) {
  return (
    <section className={className} style={{ backgroundColor: `rgba(251, 248, 242, ${bgOpacity})` }} role="banner" aria-label="Accueil">
      <div className="relative" style={{ width, height }}>
        {items.map((it) => (
          <Spot key={it.id} domId={it.id} top={it.top} left={it.left} width={`${it.w * (it.el === 'names' ? namesScale : 1.1)}%`} z={it.z} delay={it.delay}>
            {it.action ? (
              <Clickable
                onClick={it.action === 'rsvp' ? openRsvp : () => scrollToId(ANCHOR[it.action as keyof typeof ANCHOR])}
                label={ARIA[it.action]}
              >
                {renderInner(it)}
              </Clickable>
            ) : (
              renderInner(it)
            )}
          </Spot>
        ))}
      </div>
      <ScrollHint className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2" />
    </section>
  )
}

/* Portrait distribution (mobile reference #11 — no champagne, no ribbon) */
const PORTRAIT: Item[] = [
  { id: 'hyacL', el: 'hyacL', top: 34.5, left: 54.4, w: 14, z: 5 },
  { id: 'hyacR', el: 'hyacR', top: 57.8, left: 65.7, w: 16, z: 5 },
  { id: 'bouquet', el: 'bouquet', top: 73, left: 30.4, w: 18, z: 12 },
  { id: 'flower', el: 'flower', top: 76.5, left: 59.6, w: 21, z: 25 },
  { id: 'envOpen', el: 'envOpen', top: 38.8, left: 69.8, w: 30, z: 10, delay: 120, priority: true },
  { id: 'names', el: 'names', top: 11, left: 50, w: 28, z: 30 },
  { id: 'oval', el: 'oval', action: 'mariage', top: 41.8, left: 28.4, w: 27, z: 20, delay: 160 },
  { id: 'polaroid', el: 'polaroid', action: 'histoire', top: 57.8, left: 48.8, w: 23, z: 22, delay: 300 },
  { id: 'programme', el: 'programme', action: 'programme', top: 67.7, left: 73, w: 25, z: 20, delay: 220 },
  { id: 'details', el: 'details', action: 'infos', top: 74.8, left: 26.6, w: 25, z: 20, delay: 400 },
  { id: 'rsvp', el: 'envRsvp', action: 'rsvp', top: 87.5, left: 47, w: 35, z: 20, delay: 500 },
]

/* Wide distribution (xl) — spread across the width */
/* Wide distribution (desktop reference #12 — centered cluster, champagne top-right) */
const WIDE: Item[] = [
  { id: 'hyacL', el: 'hyacL', top: 30.1, left: 15.8, w: 10, z: 5 },
  { id: 'hyacR', el: 'hyacR', top: 49.9, left: 74, w: 11, z: 5 },
  { id: 'flower', el: 'flower', top: 75.4, left: 40.9, w: 12, z: 25 },
  { id: 'ribbon', el: 'ribbon', top: 39.4, left: 62.8, w: 11, z: 16 },
  { id: 'envOpen', el: 'envOpen', top: 41.2, left: 24.4, w: 16, z: 10, delay: 120, priority: true },
  { id: 'names', el: 'names', top: 14, left: 48, w: 19, z: 30 },
  { id: 'oval', el: 'oval', action: 'mariage', top: 49.3, left: 63.5, w: 15, z: 20, delay: 220 },
  { id: 'programme', el: 'programme', action: 'programme', top: 54.1, left: 37.5, w: 15, z: 20, delay: 160 },
  { id: 'polaroid', el: 'polaroid', action: 'histoire', top: 61.5, left: 50.9, w: 12, z: 22, delay: 300 },
  { id: 'details', el: 'details', action: 'infos', top: 88.2, left: 33.1, w: 16, z: 20, delay: 400 },
  { id: 'rsvp', el: 'envRsvp', action: 'rsvp', top: 79.5, left: 66.3, w: 21, z: 20, delay: 500 },
]

/* Opacité du voile ivoire de la 1ʳᵉ section (masque le fond floral derrière le collage) */
const SECTION1_BG_OPACITY = 0.75

export function CollageHome() {
  return (
    <>
      <h1 className="sr-only">
        {COLLAGE.bride} &amp; {COLLAGE.groom} — {COLLAGE.date}, {COLLAGE.city}
      </h1>

      {/* Mobile → lg: portrait collage (draggable items) */}
      <CollageStage
        className="relative flex min-h-dvh snap-start items-center justify-center overflow-hidden xl:hidden"
        width={STAGE_W}
        height={STAGE_H}
        items={PORTRAIT}
        bgOpacity={SECTION1_BG_OPACITY}
      />

      {/* xl+: wide collage spread across the width */}
      <CollageStage
        className="relative hidden min-h-dvh snap-start items-center justify-center overflow-hidden xl:flex"
        width={WIDE_W}
        height={WIDE_H}
        items={WIDE}
        namesScale={1.155}
        bgOpacity={SECTION1_BG_OPACITY}
      />
    </>
  )
}
