'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { guestCreateSchema } from '@/lib/schemas/guest'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface AddGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGuestDialog({ open, onOpenChange }: AddGuestDialogProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [maxPersons, setMaxPersons] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function resetForm() {
    setFirstName('')
    setLastName('')
    setGroupName('')
    setMaxPersons(1)
    setErrors({})
    setCreatedLink(null)
    setCopied(false)
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      resetForm()
      router.refresh()
    }
    onOpenChange(isOpen)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      groupName: groupName.trim() || undefined,
      maxPersons,
    }

    const parsed = guestCreateSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const body = await res.json()
        setErrors({ form: body.error || 'Erreur serveur' })
        return
      }

      const { link } = await res.json()
      setCreatedLink(`${window.location.origin}${link}`)
    } catch {
      setErrors({ form: 'Erreur de connexion' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopyLink() {
    if (!createdLink) return
    await navigator.clipboard.writeText(createdLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-brown-deep">
            Ajouter un invité
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire d&apos;ajout d&apos;un nouvel invité
          </DialogDescription>
        </DialogHeader>

        {createdLink ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-brown-medium">
              Invité ajouté ! Voici son lien unique :
            </p>
            <div className="rounded-md border border-brown-medium/20 bg-white-broken p-3">
              <p className="break-all text-sm font-medium text-brown-deep">
                {createdLink}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full rounded-md bg-brown-deep px-4 py-2 text-sm font-medium text-white-broken transition-colors hover:bg-brown-deep/90"
            >
              {copied ? 'Copié !' : 'Copier le lien'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label htmlFor="firstName" className="block text-sm text-brown-medium mb-1">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep placeholder:text-brown-medium/50 focus:border-gold-moroccan focus:outline-none focus:ring-1 focus:ring-gold-moroccan disabled:opacity-50"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-soft">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm text-brown-medium mb-1">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep placeholder:text-brown-medium/50 focus:border-gold-moroccan focus:outline-none focus:ring-1 focus:ring-gold-moroccan disabled:opacity-50"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-soft">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="groupName" className="block text-sm text-brown-medium mb-1">
                Groupe (optionnel)
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isLoading}
                placeholder="Ex: Famille, Amis..."
                className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep placeholder:text-brown-medium/50 focus:border-gold-moroccan focus:outline-none focus:ring-1 focus:ring-gold-moroccan disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="maxPersons" className="block text-sm text-brown-medium mb-1">
                Nombre max de personnes
              </label>
              <input
                id="maxPersons"
                type="number"
                min={1}
                max={10}
                value={maxPersons}
                onChange={(e) => setMaxPersons(parseInt(e.target.value, 10) || 1)}
                disabled={isLoading}
                className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 text-sm text-brown-deep focus:border-gold-moroccan focus:outline-none focus:ring-1 focus:ring-gold-moroccan disabled:opacity-50"
              />
            </div>

            {errors.form && (
              <p className="text-sm text-red-soft">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-brown-deep px-4 py-2 text-sm font-medium text-white-broken transition-colors hover:bg-brown-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter l\'invité'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
