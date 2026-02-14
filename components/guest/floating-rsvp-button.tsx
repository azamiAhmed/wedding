'use client'

import { type Guest } from '@/lib/db/schema'
import { RSVP } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface FloatingRsvpButtonProps {
  status: Guest['status']
  onClick?: () => void
}

export function FloatingRsvpButton({ status, onClick }: FloatingRsvpButtonProps) {
  const isPending = status === 'pending'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPending ? RSVP.ariaConfirm : RSVP.ariaModify}
      className={cn(
        'fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-6 right-6 z-50',
        'lg:left-auto lg:right-6 lg:w-auto',
        'bg-gold-moroccan text-white-broken font-sans text-base font-medium',
        'rounded-lg min-h-12 px-6 py-3',
        'active:scale-[0.97] transition-transform duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-moroccan focus-visible:outline-offset-2',
        isPending && 'rsvp-pulse'
      )}
    >
      {isPending ? RSVP.confirmButton : RSVP.modifyButton}
    </button>
  )
}
