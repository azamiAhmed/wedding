'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { type Guest } from '@/lib/db/schema'
import { RSVP } from '@/lib/constants'
import { type InviteCategory } from '@/components/guest/invite-experience'
import { FloatingRsvpButton } from './floating-rsvp-button'
import { PersonStepper } from './person-stepper'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ViewState = 'returning' | 'form' | 'result'
type RsvpStatus = Guest['status']

interface StoredRsvp {
  slug: string
  firstName: string
  lastName: string
  status: RsvpStatus
  personsConfirmed: number
}

function storageKey(category: InviteCategory) {
  return `rsvp:${category}`
}

function readStored(category: InviteCategory): StoredRsvp | null {
  try {
    const raw = window.localStorage.getItem(storageKey(category))
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredRsvp
    if (!parsed?.slug || !parsed?.firstName) return null
    return parsed
  } catch {
    return null
  }
}

function writeStored(category: InviteCategory, value: StoredRsvp) {
  try {
    window.localStorage.setItem(storageKey(category), JSON.stringify(value))
  } catch {
    // localStorage indisponible — on continue sans mémorisation
  }
}

export function RsvpOverlay({ category }: { category: InviteCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const [stored, setStored] = useState<StoredRsvp | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [personsCount, setPersonsCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<ViewState>('form')
  const [resultType, setResultType] = useState<'confirmed' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentStatus: RsvpStatus = stored?.status ?? 'pending'

  // Hydrate from localStorage (client only) — returning visitor.
  useEffect(() => {
    const s = readStored(category)
    if (s) {
      setStored(s)
      setFirstName(s.firstName)
      setLastName(s.lastName)
      setPersonsCount(s.personsConfirmed > 0 ? s.personsConfirmed : 1)
      setView('returning')
    }
  }, [category])

  function resetToInitialView() {
    setView(stored ? 'returning' : 'form')
    setResultType(null)
    setError(null)
    setPersonsCount(stored && stored.personsConfirmed > 0 ? stored.personsConfirmed : 1)
  }

  // Allow other components (e.g. the collage RSVP envelope) to open the overlay.
  useEffect(() => {
    function handleExternalOpen() {
      setIsOpen(true)
      resetToInitialView()
    }
    window.addEventListener('open-rsvp', handleExternalOpen)
    return () => window.removeEventListener('open-rsvp', handleExternalOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored])

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) resetToInitialView()
  }

  async function submitRsvp(status: 'confirmed' | 'declined') {
    const fn = firstName.trim()
    const ln = lastName.trim()
    if (!fn || !ln) {
      setError(RSVP.nameRequired)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const persons = status === 'confirmed' ? personsCount : 0
      let slug = stored?.slug

      if (slug) {
        // Modification d'une réponse existante (nom inchangé)
        const res = await fetch(`/api/invite/${slug}/rsvp`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, personsConfirmed: persons }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Erreur serveur')
      } else {
        // Nouvelle réponse
        const res = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: fn,
            lastName: ln,
            category,
            status,
            personsConfirmed: persons,
          }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Erreur serveur')
        slug = (await res.json()).slug as string
      }

      const next: StoredRsvp = {
        slug: slug!,
        firstName: fn,
        lastName: ln,
        status,
        personsConfirmed: persons,
      }
      writeStored(category, next)
      setStored(next)
      setResultType(status)
      setView('result')
    } catch (e) {
      setError(e instanceof Error ? e.message : RSVP.errorText)
    } finally {
      setIsLoading(false)
    }
  }

  const isModifying = Boolean(stored)

  return (
    <>
      <FloatingRsvpButton status={currentStatus} onClick={() => setIsOpen(true)} />

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="font-display text-2xl font-light text-brown-deep">
              {RSVP.overlayTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Formulaire de confirmation de présence
            </DialogDescription>
          </DialogHeader>

          {view === 'returning' && stored && (
            <div className="text-center py-6 space-y-4">
              {stored.status === 'confirmed' && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-olive" />
                  <p className="font-display text-xl text-brown-deep">
                    {RSVP.statusConfirmed(stored.personsConfirmed)}
                  </p>
                </>
              )}
              {stored.status === 'declined' && (
                <p className="font-sans text-base text-brown-medium">
                  {RSVP.statusDeclined}
                </p>
              )}
              <button
                type="button"
                onClick={() => setView('form')}
                className="w-full min-h-11 rounded-lg border border-gold-moroccan bg-transparent text-brown-deep font-sans text-base transition-colors duration-150 hover:bg-gold-veil/30 active:scale-[0.97]"
              >
                {RSVP.modifyStatusAction}
              </button>
            </div>
          )}

          {view === 'form' && (
            <div className="space-y-6 pt-2">
              {isModifying ? (
                /* Nom déjà connu — non modifiable */
                <div>
                  <p className="font-sans text-sm text-brown-medium">{RSVP.guestLabel}</p>
                  <p className="font-sans text-lg font-medium text-brown-deep">
                    {firstName} {lastName}
                  </p>
                </div>
              ) : (
                /* Saisie du nom (nouvelle réponse) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rsvp-firstname"
                      className="font-sans text-sm text-brown-medium"
                    >
                      {RSVP.firstNameLabel}
                    </label>
                    <input
                      id="rsvp-firstname"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={RSVP.firstNamePlaceholder}
                      disabled={isLoading}
                      className="mt-1 w-full min-h-11 rounded-lg border border-gold-moroccan/40 bg-white-broken px-3 font-sans text-base text-brown-deep outline-none transition-colors focus:border-gold-moroccan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rsvp-lastname"
                      className="font-sans text-sm text-brown-medium"
                    >
                      {RSVP.lastNameLabel}
                    </label>
                    <input
                      id="rsvp-lastname"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={RSVP.lastNamePlaceholder}
                      disabled={isLoading}
                      className="mt-1 w-full min-h-11 rounded-lg border border-gold-moroccan/40 bg-white-broken px-3 font-sans text-base text-brown-deep outline-none transition-colors focus:border-gold-moroccan"
                    />
                  </div>
                </div>
              )}

              <PersonStepper
                value={personsCount}
                onChange={setPersonsCount}
                label={RSVP.stepperLabel}
                disabled={isLoading}
              />

              {error && (
                <p className="font-sans text-sm text-red-soft text-center">{error}</p>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => submitRsvp('confirmed')}
                  disabled={isLoading}
                  className="w-full min-h-12 rounded-lg bg-gold-moroccan text-white-broken font-sans text-base font-medium transition-colors duration-150 hover:bg-gold-moroccan/90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? RSVP.loadingText : RSVP.confirmAction}
                </button>

                <button
                  type="button"
                  onClick={() => submitRsvp('declined')}
                  disabled={isLoading}
                  className="w-full min-h-11 rounded-lg border border-gold-moroccan bg-transparent text-brown-deep font-sans text-base transition-colors duration-150 hover:bg-gold-veil/30 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {RSVP.declineAction}
                </button>
              </div>
            </div>
          )}

          {view === 'result' && (
            <div className="text-center py-6">
              {resultType === 'confirmed' && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-olive" />
                  <p className="mt-4 font-display text-xl text-brown-deep">
                    {RSVP.successMessage}
                  </p>
                </>
              )}
              {resultType === 'declined' && (
                <p className="font-sans text-base text-brown-medium">
                  {RSVP.declineMessage}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
