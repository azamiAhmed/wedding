'use client'

import { useState } from 'react'

interface CopyLinkButtonProps {
  slug: string
}

export function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/invite/${slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copier le lien d'invitation"
      className="text-xs text-brown-medium underline-offset-2 hover:underline"
    >
      {copied ? 'Copié !' : 'Copier le lien'}
    </button>
  )
}
