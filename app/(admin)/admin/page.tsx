import { requireAdmin } from '@/lib/auth'
import { getAllGuests, getSiteConfig } from '@/lib/db/queries'
import { SummaryCounter } from '@/components/admin/summary-counter'
import { GuestList } from '@/components/admin/guest-list'
import { AddGuestButton } from '@/components/admin/add-guest-button'
import { ConfigToggles } from '@/components/admin/config-toggles'

export default async function AdminDashboardPage() {
  await requireAdmin()
  const [guests, config] = await Promise.all([getAllGuests(), getSiteConfig()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brown-deep">Dashboard</h1>
        <AddGuestButton />
      </div>
      <SummaryCounter guests={guests} />
      <ConfigToggles
        showVenue={config.show_venue !== 'false'}
        showProgram={config.show_program !== 'false'}
      />
      <GuestList guests={guests} />
    </div>
  )
}
