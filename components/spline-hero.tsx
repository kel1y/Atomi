"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

export function SplineHero() {
  const [webglAvailable, setWebglAvailable] = useState<boolean>(true)

  // Detect WebGL support once on mount
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      if (!gl) {
        setWebglAvailable(false)
      }
    } catch {
      setWebglAvailable(false)
    }
  }, [])

  // Load Spline viewer script only if WebGL is available
  useEffect(() => {
    if (!webglAvailable) return

    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.10.85/build/spline-viewer.js"
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [webglAvailable])

  return (
    <div className="w-full h-full rounded-2xl border border-border overflow-hidden bg-muted relative">
      {webglAvailable ? (
        <spline-viewer
          url="https://prod.spline.design/1eGLW1RlNWOAUwMn/scene.splinecode"
          style={{
            width: "calc(100% + 60px)",
            height: "calc(100% + 60px)",
            display: "block",
            marginRight: "-60px",
            marginBottom: "-60px",
          }}
        />
      ) : (
        <Image
          src="/pictures/hero-fallback.jpg"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}
    </div>
  )
}
