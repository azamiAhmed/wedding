'use client'

import { useState } from 'react'
import { AddGuestDialog } from './add-guest-dialog'

export function AddGuestButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-brown-deep px-4 py-2 text-sm font-medium text-white-broken transition-colors hover:bg-brown-deep/90"
      >
        Ajouter un invité
      </button>
      <AddGuestDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
