import { requireAdmin } from '@/lib/auth'
import { getAllGuests } from '@/lib/db/queries'
import { SummaryCounter } from '@/components/admin/summary-counter'
import { GuestList } from '@/components/admin/guest-list'

export default async function AdminDashboardPage() {
  await requireAdmin()
  const guests = await getAllGuests()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brown-deep">Dashboard</h1>
      <SummaryCounter guests={guests} />
      <GuestList guests={guests} />
    </div>
  )
}
