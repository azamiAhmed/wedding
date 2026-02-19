import type { Metadata } from 'next'
import { SaveTheDateScene } from '@/components/save-the-date/save-the-date-scene'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main
      className="flex min-h-dvh flex-col justify-center bg-cream-warm bg-cover bg-center bg-no-repeat px-6 sm:px-8"
      style={{ backgroundImage: "url('/images/rings/arriere plan.avif')" }}
    >
      <SaveTheDateScene />
    </main>
  )
}
