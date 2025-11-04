"use client"

interface ModelPlaceholderProps {
  title: string
  description: string
  splineUrl?: string
}

export function ModelPlaceholder({ title, description, splineUrl }: ModelPlaceholderProps) {
  return (
    <div className="w-full h-96 rounded-2xl border border-border bg-muted overflow-hidden">
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
        <div className="text-center space-y-3">
          <div className="text-4xl">🎯</div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground/60 mt-1">{description}</p>
          </div>
          {splineUrl && (
            <p className="text-xs text-foreground/40 mt-2">
              Spline URL: <code className="bg-foreground/5 px-2 py-1 rounded">{splineUrl}</code>
            </p>
          )}
        </div>
      </div>

      {/* Spline viewer - uncomment when ready to embed */}
      {/* {splineUrl && (
        <spline-viewer
          url={splineUrl}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      )} */}
    </div>
  )
}
