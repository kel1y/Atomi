"use client"

import { useEffect } from "react"

export function SplineHero() {
  useEffect(() => {
    // Load Spline viewer script
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.10.85/build/spline-viewer.js"
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full h-full rounded-2xl border border-border overflow-hidden bg-muted relative">
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
    </div>
  )
}
