'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

interface PigeonVoyageurProps {
  className?: string
  onReady?: () => void
}

export function PigeonVoyageur({ className, onReady }: PigeonVoyageurProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    fetch('/design/pigeon.json')
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data)
        onReady?.()
      })
      .catch(() => {
        onReady?.()
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`pigeon-container pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
    >
      {animationData && (
        <Lottie animationData={animationData} loop className="h-full w-full" />
      )}
    </div>
  )
}
