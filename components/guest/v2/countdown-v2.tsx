'use client'

import { useEffect, useState } from 'react'
import { COUNTDOWN } from '@/lib/constants'

const TARGET = new Date('2026-10-02T15:00:00+01:00').getTime()

function getDiff() {
  const now = Date.now()
  const ms = Math.max(0, TARGET - now)
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

function Cell({ value, label }: { value: number; label: string }) {
  const padded = value.toString().padStart(2, '0')
  return (
    <div className="scroll-reveal flex flex-col items-center">
      <div className="relative flex items-center justify-center min-w-[60px] sm:min-w-[88px] aspect-square rounded-md border border-gold-moroccan/40 bg-white-broken/70 backdrop-blur-sm shadow-[0_4px_20px_-12px_rgba(58,36,52,0.25)]">
        <span
          className="font-display text-2xl sm:text-5xl text-brown-deep tabular-nums"
          suppressHydrationWarning
        >
          {padded}
        </span>
        <span className="absolute -top-1 left-2 right-2 h-px bg-gold-moroccan/30" />
        <span className="absolute -bottom-1 left-2 right-2 h-px bg-gold-moroccan/30" />
      </div>
      <span className="mt-2 sm:mt-3 font-sans text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.3em] uppercase text-brown-medium">
        {label}
      </span>
    </div>
  )
}

export function CountdownV2() {
  const [diff, setDiff] = useState(() => getDiff())

  useEffect(() => {
    const id = setInterval(() => setDiff(getDiff()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="section-countdown min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-transparent"
      role="region"
      aria-label="Compte à rebours avant le mariage"
    >
      <p className="motion-safe:animate-fade-in-up font-sans text-base sm:text-lg md:text-xl tracking-[0.4em] uppercase text-brown-medium text-center">
        {COUNTDOWN.eyebrow}
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 sm:gap-5">
        <Cell value={diff.days} label="Jours" />
        <span className="hidden sm:inline font-display text-3xl text-gold-moroccan/60">·</span>
        <Cell value={diff.hours} label="Heures" />
        <span className="hidden sm:inline font-display text-3xl text-gold-moroccan/60">·</span>
        <Cell value={diff.minutes} label="Minutes" />
        <span className="hidden sm:inline font-display text-3xl text-gold-moroccan/60">·</span>
        <Cell value={diff.seconds} label="Secondes" />
      </div>

      <h2 className="motion-safe:animate-fade-in-up mt-10 font-display text-2xl sm:text-3xl md:text-[2.5rem] font-light text-brown-deep text-center leading-tight">
        {COUNTDOWN.title}
      </h2>

      <div className="scroll-reveal mt-5 mx-auto h-px w-12 bg-gold-moroccan" />

      <p className="scroll-reveal mt-8 mx-auto w-full font-display italic text-base sm:text-lg text-brown-medium text-center">
        {COUNTDOWN.intro}
      </p>
    </section>
  )
}
