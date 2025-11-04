"use client"

import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"

export function ScrollSnapVideos({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const getSlides = useCallback((): HTMLElement[] => {
    const container = containerRef.current
    if (!container) return []
    return Array.from(container.querySelectorAll<HTMLElement>("[data-video-slide]"))
  }, [])

  const getActiveIndex = useCallback((slides: HTMLElement[]) => {
    const viewportMid = window.scrollY + window.innerHeight / 2
    let closestIdx = 0
    let closestDist = Infinity
    slides.forEach((el, idx) => {
      const rect = el.getBoundingClientRect()
      const mid = window.scrollY + rect.top + rect.height / 2
      const dist = Math.abs(mid - viewportMid)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = idx
      }
    })
    return closestIdx
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let wheelTimeout: number | undefined

    const onWheel = (e: WheelEvent) => {
      if (isAnimating) {
        e.preventDefault()
        return
      }

      const slides = getSlides()
      if (slides.length === 0) return

      // Only intercept when the pointer is over this section
      const bounds = container.getBoundingClientRect()
      const inside = e.clientY >= bounds.top && e.clientY <= bounds.bottom
      if (!inside) return

      // Debounce tiny wheel deltas; require intent
      const direction = e.deltaY > 0 ? 1 : -1
      if (Math.abs(e.deltaY) < 8) return

      e.preventDefault()

      const current = getActiveIndex(slides)
      let targetIdx = current + direction
      targetIdx = Math.max(0, Math.min(slides.length - 1, targetIdx))
      const target = slides[targetIdx]
      if (!target) return

      setIsAnimating(true)
      const top = window.scrollY + target.getBoundingClientRect().top - 80 // slight offset
      window.scrollTo({ top, behavior: "smooth" })

      // End animation state after a short duration
      window.clearTimeout(wheelTimeout)
      wheelTimeout = window.setTimeout(() => setIsAnimating(false), 700)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", onWheel as EventListener)
      if (wheelTimeout) window.clearTimeout(wheelTimeout)
    }
  }, [getSlides, getActiveIndex, isAnimating])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}


