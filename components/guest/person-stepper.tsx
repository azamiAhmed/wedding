'use client'

import { cn } from '@/lib/utils'

interface PersonStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
  disabled?: boolean
}

export function PersonStepper({
  value,
  onChange,
  min = 1,
  max = 5,
  label,
  disabled = false,
}: PersonStepperProps) {
  const atMin = value <= min
  const atMax = value >= max

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault()
        if (!atMax) onChange(value + 1)
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault()
        if (!atMin) onChange(value - 1)
        break
      case 'Home':
        e.preventDefault()
        onChange(min)
        break
      case 'End':
        e.preventDefault()
        onChange(max)
        break
    }
  }

  return (
    <div>
      <p className="font-sans text-sm text-brown-medium mb-3">{label}</p>
      <div
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} personne${value > 1 ? 's' : ''}`}
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-center gap-4"
      >
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={atMin || disabled}
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            'flex items-center justify-center h-12 w-12 rounded-lg border text-lg font-medium transition-colors duration-150',
            atMin || disabled
              ? 'border-brown-medium/30 text-brown-medium/30 cursor-not-allowed'
              : 'border-gold-moroccan text-gold-moroccan hover:bg-gold-moroccan/10 active:scale-95'
          )}
        >
          −
        </button>

        <span className="font-sans text-2xl font-medium text-brown-deep w-10 text-center tabular-nums">
          {value}
        </span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={atMax || disabled}
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            'flex items-center justify-center h-12 w-12 rounded-lg border text-lg font-medium transition-colors duration-150',
            atMax || disabled
              ? 'border-brown-medium/30 text-brown-medium/30 cursor-not-allowed'
              : 'border-gold-moroccan text-gold-moroccan hover:bg-gold-moroccan/10 active:scale-95'
          )}
        >
          +
        </button>
      </div>
    </div>
  )
}
