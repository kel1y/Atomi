"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GSAPScrollAnimationProps {
  children: React.ReactNode
  className?: string
  animationType?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "slideInUp"
  duration?: number
  delay?: number
}

export function GSAPScrollAnimation({
  children,
  className = "",
  animationType = "fadeInUp",
  duration = 0.8,
  delay = 0,
}: GSAPScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const animations: Record<string, () => void> = {
      fadeInUp: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      },
      fadeInLeft: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      },
      fadeInRight: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      },
      scaleIn: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      },
      slideInUp: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      },
    }

    animations[animationType]?.()

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [animationType, duration, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
