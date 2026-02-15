'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        return
      }

      const data = await res.json()
      setError(data.error || 'Erreur de connexion')
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label
          htmlFor="password"
          className="block font-sans text-sm text-brown-medium mb-1"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          disabled={isLoading}
          className="w-full rounded-md border border-brown-medium/30 bg-white-broken px-3 py-2 font-sans text-sm text-brown-deep placeholder:text-brown-medium/50 focus:border-gold-moroccan focus:outline-none focus:ring-1 focus:ring-gold-moroccan disabled:opacity-50"
          placeholder="Entrez le mot de passe"
        />
      </div>

      {error && (
        <p className="font-sans text-sm text-red-soft">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-brown-deep px-4 py-2 font-sans text-sm font-medium text-white-broken transition-colors hover:bg-brown-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Connexion...' : 'Connexion'}
      </button>
    </form>
  )
}
