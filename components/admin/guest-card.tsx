import { type Guest } from '@/lib/db/schema'
import { StatusBadge } from './status-badge'
import { CopyLinkButton } from './copy-link-button'
import { DeleteGuestButton } from './delete-guest-button'
import { EditGuestButton } from './edit-guest-button'

interface GuestCardListProps {
  guests: Guest[]
}

export function GuestCardList({ guests }: GuestCardListProps) {
  return (
    <div className="space-y-3">
      {guests.map((guest) => (
        <div
          key={guest.id}
          className="rounded-lg border border-brown-medium/20 bg-white-broken p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-brown-deep">
              {guest.lastName} {guest.firstName}
            </p>
            <StatusBadge status={guest.status} />
          </div>
          <div className="flex items-center justify-between text-sm text-brown-medium">
            <span>
              {guest.status === 'confirmed'
                ? `${guest.personsConfirmed} personne${guest.personsConfirmed !== 1 ? 's' : ''}`
                : '—'}
            </span>
            <div className="flex items-center gap-3">
              <CopyLinkButton slug={guest.slug} />
              <EditGuestButton guest={guest} />
              <DeleteGuestButton
                guestId={guest.id}
                guestName={`${guest.lastName} ${guest.firstName}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
