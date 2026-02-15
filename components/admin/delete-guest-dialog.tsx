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

interface DeleteGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guestId: number
  guestName: string
}

export function DeleteGuestDialog({
  open,
  onOpenChange,
  guestId,
  guestName,
}: DeleteGuestDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'DELETE',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-brown-deep">
            Supprimer l&apos;invité
          </DialogTitle>
          <DialogDescription className="text-sm text-brown-medium">
            Êtes-vous sûr de vouloir supprimer {guestName} ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-soft">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 rounded-md border border-brown-medium/30 bg-transparent px-4 py-2 text-sm text-brown-deep transition-colors hover:bg-brown-medium/10 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-md bg-red-soft px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-soft/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
