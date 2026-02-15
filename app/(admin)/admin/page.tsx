import { requireAdmin } from '@/lib/auth'

export default async function AdminDashboardPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold text-brown-deep">
        Dashboard
      </h1>
      <p className="mt-2 font-sans text-sm text-brown-medium">
        Bienvenue dans l&apos;espace administration.
      </p>
    </div>
  )
}
