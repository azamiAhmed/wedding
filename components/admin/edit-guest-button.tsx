'use client'

import { useState } from 'react'
import { EditGuestDialog } from './edit-guest-dialog'
import { type Guest } from '@/lib/db/schema'

interface EditGuestButtonProps {
  guest: Guest
}

export function EditGuestButton({ guest }: EditGuestButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-gold-moroccan underline-offset-2 hover:underline"
      >
        Modifier
      </button>
      <EditGuestDialog
        open={open}
        onOpenChange={setOpen}
        guest={guest}
      />
    </>
  )
}
