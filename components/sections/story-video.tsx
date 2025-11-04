"use client"

import { useEffect, useRef, useState } from "react"
import { NarrativeBeat } from "./narrative-beat"

interface Beat {
  at: number // scroll progress 0..1
  text: string
}

interface VideoSource {
  src: string
  type: "video/webm" | "video/mp4"
  media?: string
}

interface StoryVideoProps {
  id: string
  title: string
  subtitle?: string
  posterSrc: string
  sources: VideoSource[]
  beats: Beat[]
  scrim?: "none" | "light" | "strong"
  cta?: { label: string; href: string }
}

export function StoryVideo({ id, title, subtitle, posterSrc, sources, beats, scrim = "strong", cta }: StoryVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [showCCToggle, setShowCCToggle] = useState(false)
  const [ccEnabled, setCCEnabled] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Intersection Observer for autoplay/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (videoRef.current) {
          if (entry.isIntersecting && !prefersReducedMotion) {
            videoRef.current.play().catch(() => {})
          } else {
            videoRef.current.pause()
          }
        }
      },
      { threshold: 0.5 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  // Scroll progress tracking
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return

    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const viewportHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const progress = Math.max(0, Math.min(1, (viewportHeight - elementTop) / (viewportHeight + elementHeight)))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prefersReducedMotion])

  // Handle video looping and beat progression
  useEffect(() => {
    if (!videoRef.current || prefersReducedMotion) return

    const handleEnded = () => {
      // Seamlessly loop the video
      videoRef.current!.currentTime = 0
      videoRef.current!.play().catch(() => {})
    }

    videoRef.current.addEventListener("ended", handleEnded)
    return () => videoRef.current?.removeEventListener("ended", handleEnded)
  }, [prefersReducedMotion])

  const handleReplayText = () => {
    setScrollProgress(0)
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  // Determine scrim gradient
  const scrimClass = {
    none: "",
    light: "bg-gradient-to-t from-black/30 via-black/10 to-transparent",
    strong: "bg-gradient-to-t from-black/60 via-black/30 to-transparent",
  }[scrim]

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Video Background */}
      {!prefersReducedMotion ? (
        <video
          ref={videoRef}
          poster={posterSrc}
          muted
          playsInline
          loop={false}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          {sources.map((source, idx) => (
            <source key={idx} src={source.src} type={source.type} media={source.media} />
          ))}
        </video>
      ) : (
        <img
          src={posterSrc || "/placeholder.svg"}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Gradient Scrim */}
      <div className={`absolute inset-0 ${scrimClass}`} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white text-balance">
            {title}
          </h2>
          {subtitle && <p className="text-lg md:text-xl text-white/70 text-balance">{subtitle}</p>}
        </div>

        {/* Narrative Beats */}
        <div className="space-y-6 min-h-[200px]">
          {prefersReducedMotion ? (
            // Reduced motion: show all beats statically
            <div className="space-y-4">
              {beats.map((beat, idx) => (
                <p key={idx} className="text-xl md:text-2xl text-white/80">
                  {beat.text}
                </p>
              ))}
            </div>
          ) : (
            // Normal: scroll-driven reveals
            beats.map((beat, idx) => (
              <NarrativeBeat key={idx} text={beat.text} progress={scrollProgress} threshold={0.15} delay={idx * 50} />
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          {prefersReducedMotion && (
            <>
              <button
                onClick={handlePlayVideo}
                className="px-6 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                aria-label="Play video"
              >
                Play Video
              </button>
              <button
                onClick={() => setShowCCToggle(!showCCToggle)}
                className="px-6 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                aria-label="Toggle captions"
              >
                CC
              </button>
            </>
          )}
        </div>

        {/* CTA */}
        {cta && (
          <div className="pt-4">
            <a
              href={cta.href}
              className="inline-block px-8 py-3 text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors font-medium"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>

      {/* Scroll Progress Indicator (subtle) */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
