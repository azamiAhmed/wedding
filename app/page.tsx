import type { Metadata } from 'next'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8">
      <SaveTheDateContent />
    </main>
  )
}
