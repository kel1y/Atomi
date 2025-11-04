"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({ children, delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (isVisible) return "translate(0, 0) opacity-100"
    switch (direction) {
      case "up":
        return "translate(0, 40px) opacity-0"
      case "down":
        return "translate(0, -40px) opacity-0"
      case "left":
        return "translate(40px, 0) opacity-0"
      case "right":
        return "translate(-40px, 0) opacity-0"
      default:
        return "translate(0, 40px) opacity-0"
    }
  }

  return (
    <div
      ref={ref}
      style={{
        transform: getTransform(),
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {children}
    </div>
  )
}
