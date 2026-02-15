'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { type Guest } from '@/lib/db/schema'
import { RSVP } from '@/lib/constants'
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

interface RsvpOverlayProps {
  slug: string
  guestFirstName: string
  initialStatus: Guest['status']
  initialPersonsConfirmed: number
}

export function RsvpOverlay({
  slug,
  guestFirstName,
  initialStatus,
  initialPersonsConfirmed,
}: RsvpOverlayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const initialCount = initialPersonsConfirmed > 0 ? initialPersonsConfirmed : 1
  const [personsCount, setPersonsCount] = useState(initialCount)
  const [savedPersonsCount, setSavedPersonsCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<ViewState>(
    initialStatus !== 'pending' ? 'returning' : 'form'
  )
  const [resultType, setResultType] = useState<
    'confirmed' | 'declined' | null
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(initialStatus)

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) {
      setPersonsCount(savedPersonsCount)
      setView(currentStatus !== 'pending' ? 'returning' : 'form')
      setResultType(null)
      setError(null)
    }
  }

  async function submitRsvp(status: 'confirmed' | 'declined') {
    setIsLoading(true)
    setError(null)
    try {
      const body =
        status === 'confirmed'
          ? { status, personsConfirmed: personsCount }
          : { status }
      const res = await fetch(`/api/invite/${slug}/rsvp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur serveur')
      }
      setResultType(status)
      setView('result')
      setCurrentStatus(status)
      if (status === 'confirmed') {
        setSavedPersonsCount(personsCount)
      } else {
        setSavedPersonsCount(1)
        setPersonsCount(1)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : RSVP.errorText)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <FloatingRsvpButton
        status={currentStatus}
        onClick={() => setIsOpen(true)}
      />

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

          {view === 'returning' && (
            <div className="text-center py-6 space-y-4">
              {currentStatus === 'confirmed' && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-olive" />
                  <p className="font-display text-xl text-brown-deep">
                    {RSVP.statusConfirmed(savedPersonsCount)}
                  </p>
                </>
              )}
              {currentStatus === 'declined' && (
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
              {/* Guest name (non-editable) */}
              <div>
                <p className="font-sans text-sm text-brown-medium">
                  {RSVP.guestLabel}
                </p>
                <p className="font-sans text-lg font-medium text-brown-deep">
                  {guestFirstName}
                </p>
              </div>

              {/* Person stepper */}
              <PersonStepper
                value={personsCount}
                onChange={setPersonsCount}
                label={RSVP.stepperLabel}
                disabled={isLoading}
              />

              {/* Error message */}
              {error && (
                <p className="font-sans text-sm text-red-soft text-center">
                  {error}
                </p>
              )}

              {/* Action buttons */}
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
