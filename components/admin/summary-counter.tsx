import { type Guest } from '@/lib/db/schema'

interface SummaryCounterProps {
  guests: Guest[]
}

export function SummaryCounter({ guests }: SummaryCounterProps) {
  const total = guests.length
  const confirmed = guests.filter((g) => g.status === 'confirmed').length
  const totalPersons = guests
    .filter((g) => g.status === 'confirmed')
    .reduce((sum, g) => sum + g.personsConfirmed, 0)

  return (
    <div className="rounded-lg border border-brown-medium/20 bg-white-broken p-4">
      <p className="text-lg font-medium text-brown-deep">
        <span className="text-2xl font-semibold">{confirmed}</span> confirmés /{' '}
        <span className="text-2xl font-semibold">{total}</span> invités{' '}
        <span className="text-sm text-brown-medium">
          ({totalPersons} personne{totalPersons !== 1 ? 's' : ''} au total)
        </span>
      </p>
    </div>
  )
}
