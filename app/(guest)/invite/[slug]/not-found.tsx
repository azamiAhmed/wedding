import type { Metadata } from 'next'
import { COUPLE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Lien invalide — ${COUPLE.names}`,
}

export default function NotFound() {
  return (
    <section
      className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 text-center"
      role="region"
      aria-label="Page non trouvée"
    >
      <h1 className="font-display text-4xl md:text-[3.5rem] text-brown-deep leading-tight">
        Ce lien ne semble pas valide
      </h1>
      <div className="mt-8 space-y-4">
        <p className="font-sans text-lg text-brown-medium">
          Le lien que vous avez utilisé ne correspond à aucune invitation.
        </p>
        <p className="font-sans text-base text-brown-medium">
          Contactez {COUPLE.contactNames} si vous pensez qu&apos;il s&apos;agit
          d&apos;une erreur.
        </p>
      </div>
    </section>
  )
}
