import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ATOMi - Rwanda's Nuclear Energy Future",
  description:
    "ATOMi is leading Africa's nuclear energy revolution. We're building sustainable, clean power solutions that will transform Rwanda into a regional energy hub.",
  keywords: ["nuclear energy", "Rwanda", "clean energy", "sustainable power", "Africa energy", "nuclear technology"],
  authors: [{ name: "ATOMi" }],
  creator: "ATOMi",
  publisher: "ATOMi",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://atomi.rw",
    siteName: "ATOMi",
    title: "ATOMi - Rwanda's Nuclear Energy Future",
    description:
      "ATOMi is leading Africa's nuclear energy revolution. We're building sustainable, clean power solutions that will transform Rwanda into a regional energy hub.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATOMi - Rwanda's Nuclear Energy Future",
    description:
      "ATOMi is leading Africa's nuclear energy revolution. We're building sustainable, clean power solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://atomi.rw" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
