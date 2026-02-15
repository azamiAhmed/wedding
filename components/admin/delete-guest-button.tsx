'use client'

import { useState } from 'react'
import { DeleteGuestDialog } from './delete-guest-dialog'

interface DeleteGuestButtonProps {
  guestId: number
  guestName: string
}

export function DeleteGuestButton({ guestId, guestName }: DeleteGuestButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-red-soft underline-offset-2 hover:underline"
      >
        Supprimer
      </button>
      <DeleteGuestDialog
        open={open}
        onOpenChange={setOpen}
        guestId={guestId}
        guestName={guestName}
      />
    </>
  )
}
