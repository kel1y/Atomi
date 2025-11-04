"use client"

import { useEffect, useState } from "react"

interface NarrativeBeatProps {
  text: string
  progress: number // 0-1, where this beat should be visible
  threshold?: number // how close progress needs to be (default 0.1)
  delay?: number // stagger delay in ms
}

export function NarrativeBeat({ text, progress, threshold = 0.1, delay = 0 }: NarrativeBeatProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const [translateY, setTranslateY] = useState(24)

  useEffect(() => {
    // Check if progress is within threshold of this beat's target
    const isInRange = Math.abs(progress - progress) < threshold

    if (isInRange && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setOpacity(1)
        setTranslateY(0)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [progress, threshold, delay, isVisible])

  return (
    <div
      className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-white text-balance"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
      }}
    >
      {text}
    </div>
  )
}
