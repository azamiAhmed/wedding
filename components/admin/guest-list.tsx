import { type Guest } from '@/lib/db/schema'
import { GuestTable } from './guest-table'
import { GuestCardList } from './guest-card'

interface GuestListProps {
  guests: Guest[]
}

export function GuestList({ guests }: GuestListProps) {
  if (guests.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-brown-medium">
        Aucun invité pour le moment.
      </p>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <GuestTable guests={guests} />
      </div>
      <div className="block md:hidden">
        <GuestCardList guests={guests} />
      </div>
    </>
  )
}
