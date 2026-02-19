'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GoldenFrame } from '@/components/save-the-date/golden-frame'
import { PigeonVoyageur } from '@/components/save-the-date/pigeon-voyageur'
import { Envelope } from '@/components/save-the-date/envelope'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'

export function SaveTheDateScene() {
  const [ready, setReady] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const startAnimations = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true)
      })
    })
  }, [])

  const handlePigeonReady = useCallback(() => {
    startAnimations()
  }, [startAnimations])

  // Fallback: start animations after 3s even if pigeon fails to load
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 3000)
    return () => clearTimeout(timeout)
  }, [])

  // Force CSS animation restart on HMR remount
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.classList.remove('scene-ready')
  }, [])

  // Hide pigeon permanently after animation — prevents re-flash on breakpoint change
  useEffect(() => {
    if (!ready) return
    const timeout = setTimeout(() => {
      const pigeon = wrapperRef.current?.querySelector('.pigeon-container')
      if (pigeon) pigeon.classList.add('pigeon-done')
    }, 3600)
    return () => clearTimeout(timeout)
  }, [ready])

  // Hide envelope permanently after animation — prevents re-flash on breakpoint change
  useEffect(() => {
    if (!ready) return
    const timeout = setTimeout(() => {
      const envelope = wrapperRef.current?.querySelector('.envelope-container')
      if (envelope) envelope.classList.add('envelope-done')
    }, 5100)
    return () => clearTimeout(timeout)
  }, [ready])

  return (
    <div ref={wrapperRef} className={ready ? 'scene-ready' : ''}>
      <GoldenFrame>
        <div className="envelope-wrapper pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <Envelope className="h-28 w-[168px] sm:h-44 sm:w-[264px] lg:h-[100px] lg:w-[150px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <PigeonVoyageur
            className="h-56 w-60 sm:h-80 sm:w-96 lg:h-48 lg:w-[13rem]"
            onReady={handlePigeonReady}
          />
        </div>
        <SaveTheDateContent />
      </GoldenFrame>
    </div>
  )
}
