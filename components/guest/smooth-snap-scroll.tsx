'use client'

import { useEffect } from 'react'

const SCROLL_DURATION = 1200 // ms — durée de la transition entre sections

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function SmoothSnapScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const container = document.querySelector('.guest-scroll-container') as HTMLElement | null
    if (!container) return

    // === IntersectionObserver: toggle .in-view (toutes tailles) ===
    const sections = container.querySelectorAll(
      '.section-info, .section-timeline, .section-venue, .section-program, .section-merci'
    )
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          } else {
            entry.target.classList.remove('in-view')
          }
        }
      },
      { root: container, threshold: 0.4 }
    )
    sections.forEach((s) => sectionObserver.observe(s))

    // === Smooth snap scroll: desktop only (≥1024px) ===
    let isScrolling = false
    let animationId: number | null = null
    const isDesktop = window.innerWidth >= 1024

    function getSnapSections(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>('[class*="snap-start"]'))
    }

    function getCurrentIndex(): number {
      const snapSections = getSnapSections()
      const scrollTop = container!.scrollTop

      let closest = 0
      let minDist = Infinity
      for (let i = 0; i < snapSections.length; i++) {
        const dist = Math.abs(snapSections[i].offsetTop - scrollTop)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      }
      return closest
    }

    function smoothScrollTo(targetY: number) {
      if (isScrolling) return
      isScrolling = true

      container!.style.scrollSnapType = 'none'

      const startY = container!.scrollTop
      const distance = targetY - startY
      if (Math.abs(distance) < 5) {
        container!.style.scrollSnapType = ''
        isScrolling = false
        return
      }

      const startTime = performance.now()

      function step(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / SCROLL_DURATION, 1)
        const eased = easeInOutCubic(progress)

        container!.scrollTop = startY + distance * eased

        if (progress < 1) {
          animationId = requestAnimationFrame(step)
        } else {
          container!.scrollTop = targetY
          container!.style.scrollSnapType = ''
          isScrolling = false
          animationId = null
        }
      }

      animationId = requestAnimationFrame(step)
    }

    function handleWheel(e: WheelEvent) {
      if (isScrolling) {
        e.preventDefault()
        return
      }

      if (Math.abs(e.deltaY) < 30) return

      e.preventDefault()

      const snapSections = getSnapSections()
      const current = getCurrentIndex()
      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = current + direction

      if (nextIndex < 0 || nextIndex >= snapSections.length) return

      smoothScrollTo(snapSections[nextIndex].offsetTop)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) return
      e.preventDefault()

      if (isScrolling) return

      const snapSections = getSnapSections()
      const current = getCurrentIndex()
      const direction = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : -1
      const nextIndex = current + direction

      if (nextIndex < 0 || nextIndex >= snapSections.length) return

      smoothScrollTo(snapSections[nextIndex].offsetTop)
    }

    if (isDesktop) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      sectionObserver.disconnect()
      if (isDesktop) {
        container.removeEventListener('wheel', handleWheel)
        window.removeEventListener('keydown', handleKeyDown)
      }
      if (animationId) cancelAnimationFrame(animationId)
      container.style.scrollSnapType = ''
    }
  }, [])

  return null
}
