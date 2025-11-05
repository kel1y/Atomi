"use client"

import { PropsWithChildren } from "react"

// Simplified container to avoid wheel interception that caused scroll jank
export function ScrollSnapVideos({ children }: PropsWithChildren) {
  return <div>{children}</div>
}

