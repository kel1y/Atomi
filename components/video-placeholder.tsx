"use client"

import { Play } from "lucide-react"

interface VideoPlaceholderProps {
  title: string
  description: string
  videoUrl?: string
}

export function VideoPlaceholder({ title, description, videoUrl }: VideoPlaceholderProps) {
  return (
    <div className="relative w-full h-96 rounded-2xl border border-border bg-muted overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto group-hover:bg-foreground/20 transition-colors">
            <Play className="w-8 h-8 text-foreground/50 fill-foreground/50" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground/60 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Video element - uncomment when video URL is available */}
      {/* {videoUrl && (
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          poster="/video-thumbnail.png"
        />
      )} */}
    </div>
  )
}
