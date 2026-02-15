'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { type Guest } from '@/lib/db/schema'
import { guestUpdateSchema } from '@/lib/schemas/guest'

interface EditGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guest: Guest
}

export function EditGuestDialog({
  open,
  onOpenChange,
  guest,
}: EditGuestDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(guest.status)
  const [personsConfirmed, setPersonsConfirmed] = useState(guest.personsConfirmed)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function resetForm() {
    setStatus(guest.status)
    setPersonsConfirmed(guest.personsConfirmed)
    setError(null)
    setFieldErrors({})
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      resetForm()
    }
    onOpenChange(value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setError(null)

    const parsed = guestUpdateSchema.safeParse({ status, personsConfirmed })
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const [key, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[key] = messages[0]
        }
      }
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur serveur')
        return
      }

      onOpenChange(false)
      router.refresh()
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-brown-deep">
            Modifier le statut
          </DialogTitle>
          <DialogDescription className="text-sm text-brown-medium">
            {guest.lastName} {guest.firstName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="edit-status" className="text-sm text-brown-medium">
              Statut
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep focus:border-gold-moroccan focus:outline-none"
            >
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="declined">Décliné</option>
            </select>
            {fieldErrors.status && (
              <p className="text-sm text-red-soft">{fieldErrors.status}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-persons" className="text-sm text-brown-medium">
              Nombre de personnes
            </label>
            <input
              id="edit-persons"
              type="number"
              min={0}
              max={5}
              value={personsConfirmed}
              onChange={(e) => setPersonsConfirmed(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep focus:border-gold-moroccan focus:outline-none"
            />
            {fieldErrors.personsConfirmed && (
              <p className="text-sm text-red-soft">{fieldErrors.personsConfirmed}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-soft">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1 rounded-md border border-brown-medium/30 bg-transparent px-4 py-2 text-sm text-brown-deep transition-colors hover:bg-brown-medium/10 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md bg-gold-moroccan px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-moroccan/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
