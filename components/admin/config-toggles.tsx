'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface ConfigTogglesProps {
  showVenue: boolean
  showProgram: boolean
}

interface ToggleItem {
  key: 'show_venue' | 'show_program'
  label: string
  description: string
}

const toggles: ToggleItem[] = [
  {
    key: 'show_venue',
    label: 'Section Lieu',
    description: 'Visible pour les invités',
  },
  {
    key: 'show_program',
    label: 'Section Programme',
    description: 'Visible pour les invités',
  },
]

export function ConfigToggles({ showVenue, showProgram }: ConfigTogglesProps) {
  const [values, setValues] = useState<Record<string, boolean>>({
    show_venue: showVenue,
    show_program: showProgram,
  })
  const [loading, setLoading] = useState<string | null>(null)

  async function handleToggle(key: string, checked: boolean) {
    const previous = values[key]
    setValues((prev) => ({ ...prev, [key]: checked }))
    setLoading(key)

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: String(checked) }),
      })

      if (!res.ok) {
        setValues((prev) => ({ ...prev, [key]: previous }))
      }
    } catch {
      setValues((prev) => ({ ...prev, [key]: previous }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-lg border border-brown-medium/20 bg-white-broken p-4 space-y-4">
      <h2 className="text-sm font-semibold text-brown-deep">
        Sections du site
      </h2>
      {toggles.map((toggle) => (
        <div key={toggle.key} className="flex items-center justify-between">
          <div>
            <label
              htmlFor={`toggle-${toggle.key}`}
              className="text-sm font-medium text-brown-deep"
            >
              {toggle.label}
            </label>
            <p className="text-xs text-brown-medium">{toggle.description}</p>
          </div>
          <Switch
            id={`toggle-${toggle.key}`}
            checked={values[toggle.key]}
            onCheckedChange={(checked) => handleToggle(toggle.key, checked)}
            disabled={loading === toggle.key}
          />
        </div>
      ))}
    </div>
  )
}
