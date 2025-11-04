"use client"

import { useEffect, useRef } from "react"

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let animationId: number
    let rotation = 0

    const drawReactor = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = Math.min(canvas.width, canvas.height) / 4

      // Clear canvas
      ctx.fillStyle = "var(--color-background)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Save context
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw outer ring
      ctx.strokeStyle = "var(--color-foreground)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, scale, 0, Math.PI * 2)
      ctx.stroke()

      // Draw inner rings
      ctx.strokeStyle = "var(--color-foreground)"
      ctx.globalAlpha = 0.6
      ctx.lineWidth = 1
      for (let i = 1; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, (scale * i) / 3, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw core
      ctx.globalAlpha = 1
      ctx.fillStyle = "var(--color-primary)"
      ctx.beginPath()
      ctx.arc(0, 0, scale / 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw energy lines
      ctx.strokeStyle = "var(--color-primary)"
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.8
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * scale * 0.8, Math.sin(angle) * scale * 0.8)
        ctx.stroke()
      }

      // Draw rotating particles
      ctx.globalAlpha = 0.7
      ctx.fillStyle = "var(--color-primary)"
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + rotation
        const x = Math.cos(angle) * scale * 0.6
        const y = Math.sin(angle) * scale * 0.6
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      rotation += 0.01
      animationId = requestAnimationFrame(drawReactor)
    }

    drawReactor()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl border border-border"
      style={{ background: "var(--color-muted)" }}
    />
  )
}
