'use client'

import { useState } from 'react'
import { LISTE_MARIAGE } from '@/lib/constants'
import { cn } from '@/lib/utils'

const RIB = LISTE_MARIAGE.rib

function CopyButton({ value, fieldKey }: { value: string; fieldKey: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard indisponible (contexte non sécurisé) — on ignore silencieusement
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${RIB.copyLabel} ${fieldKey}`}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5',
        'font-sans text-xs transition-colors duration-150 active:scale-[0.97]',
        copied
          ? 'border-green-olive/50 text-green-olive'
          : 'border-gold-moroccan/40 text-brown-medium hover:bg-gold-veil/30'
      )}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
      {copied ? RIB.copiedLabel : RIB.copyLabel}
    </button>
  )
}

function Row({
  label,
  value,
  copyValue,
  mono = false,
}: {
  label: string
  value: string
  copyValue?: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-gold-moroccan/15 py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="text-left">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brown-medium">
          {label}
        </p>
        <p
          className={cn(
            'mt-1 text-brown-deep',
            mono ? 'font-mono text-sm tracking-wide sm:text-base' : 'font-sans text-base'
          )}
        >
          {value}
        </p>
      </div>
      {copyValue && <CopyButton value={copyValue} fieldKey={label} />}
    </div>
  )
}

export function RibCard() {
  return (
    <div className="mt-8 w-full text-left">
      <p className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-brown-deep text-center">
        {RIB.heading}
      </p>
      <p className="mt-2 font-display text-base text-brown-deep text-center leading-relaxed">
        {RIB.intro}
      </p>

      <div className="mt-5 rounded-xl border border-gold-moroccan/25 bg-white-broken/60 px-5 py-2 sm:px-7">
        <Row label={RIB.holderLabel} value={RIB.holder} />
        <Row label={RIB.bankLabel} value={RIB.bank} />
        <Row label={RIB.ibanLabel} value={RIB.iban} copyValue={RIB.ibanRaw} mono />
        <Row label={RIB.bicLabel} value={RIB.bic} copyValue={RIB.bic} mono />
      </div>
    </div>
  )
}
