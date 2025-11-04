"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SplineHero } from "@/components/spline-hero"
import { GSAPScrollAnimation } from "@/components/gsap-scroll-animation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StoryVideo } from "@/components/sections/story-video"
import { ScrollSnapVideos } from "@/components/sections/scroll-snap-videos"
 

 

export default function Home() {
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Spline Model Background */}
        <div className="absolute inset-0 z-0">
          <SplineHero />
        </div>

        {/* Overlay Content - Minimal text */}
        <div className="relative z-10 text-center space-y-6 px-4 max-w-2xl">
          <GSAPScrollAnimation animationType="fadeInUp" duration={1}>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance text-white drop-shadow-lg">
              Nuclear Energy Revolution
            </h1>
          </GSAPScrollAnimation>

          <GSAPScrollAnimation animationType="fadeInUp" duration={1} delay={0.2}>
            <p className="text-lg lg:text-xl text-white/80 drop-shadow-md">
              Powering Rwanda's sustainable future with advanced fission technology
            </p>
          </GSAPScrollAnimation>

          <GSAPScrollAnimation animationType="fadeInUp" duration={1} delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GSAPScrollAnimation>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black">Why Nuclear Energy?</h2>
          </div>

          <ScrollSnapVideos>
            <div data-video-slide>
              <StoryVideo
                id="clean-energy"
                title="Clean Energy"
                posterSrc="/videos/clean-energy-poster.webp"
                sources={[
                  {
                    src: "/videos/clean-energy-1080.webm",
                    type: "video/webm",
                    media: "(min-width: 1024px)",
                  },
                  {
                    src: "/videos/clean-energy-720.mp4",
                    type: "video/mp4",
                  },
                ]}
                beats={[
                  { at: 0.15, text: "Rwanda's landscapes deserve truly clean power." },
                  {
                    at: 0.4,
                    text: "Nuclear delivers electricity with near‑zero lifecycle emissions.",
                  },
                  { at: 0.75, text: "Clean energy at grid scale—day and night." },
                ]}
                scrim="strong"
              />
            </div>

            <div data-video-slide>
              <StoryVideo
                id="reliable-power"
                title="Reliable Power"
                posterSrc="/videos/reliable-power-poster.webp"
                sources={[
                  {
                    src: "/videos/reliable-power-1080.webm",
                    type: "video/webm",
                    media: "(min-width: 1024px)",
                  },
                  {
                    src: "/videos/reliable-power-720.mp4",
                    type: "video/mp4",
                  },
                ]}
                beats={[
                  { at: 0.2, text: "Power you can plan around." },
                  {
                    at: 0.5,
                    text: "Baseload generation—steady output, whatever the weather.",
                  },
                  { at: 0.8, text: "Consistent supply that unlocks modern life." },
                ]}
                scrim="strong"
              />
            </div>

            <div data-video-slide>
              <StoryVideo
                id="economic-growth"
                title="Economic Growth"
                posterSrc="/videos/economic-growth-poster.webp"
                sources={[
                  {
                    src: "/videos/economic-growth-1080.webm",
                    type: "video/webm",
                    media: "(min-width: 1024px)",
                  },
                  {
                    src: "/videos/economic-growth-720.mp4",
                    type: "video/mp4",
                  },
                ]}
                beats={[
                  { at: 0.2, text: "Affordable energy drives industry." },
                  {
                    at: 0.5,
                    text: "Manufacturing, jobs, and regional investment follow reliable power.",
                  },
                  { at: 0.85, text: "Prosperity built on stable electricity." },
                ]}
                scrim="strong"
              />
            </div>
          </ScrollSnapVideos>
        </div>
      </section>

      

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section 1: Reactor Technology */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <GSAPScrollAnimation animationType="fadeInLeft">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase">Advanced Technology</p>
                <h2 className="text-4xl font-bold">Reactor Core Design</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Our state-of-the-art reactor designs incorporate the latest safety innovations and efficiency
                  improvements. Each system is engineered to meet the highest international standards while maximizing
                  power output and minimizing waste.
                </p>
                <div className="pt-4">
                  
                </div>
              </div>
            </GSAPScrollAnimation>

            <GSAPScrollAnimation animationType="fadeInRight">
              <div className="relative w-full h-full">
                <Image
                  src="/pictures/reactor.jpg"
                  alt="Reactor core design"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-xl border border-border object-cover"
                  priority
                />
              </div>
            </GSAPScrollAnimation>
          </div>

          {/* Section 2: Safety Systems - Video Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <GSAPScrollAnimation animationType="fadeInLeft" delay={0.1}>
              <div className="relative w-full h-full">
                <Image
                  src="/pictures/safety.jpg"
                  alt="Comprehensive safety systems"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-xl border border-border object-cover"
                />
              </div>
            </GSAPScrollAnimation>

            <GSAPScrollAnimation animationType="fadeInRight" delay={0.1}>
              <div className="space-y-4 order-2 lg:order-1">
                <p className="text-sm font-semibold text-muted-foreground uppercase">Safety First</p>
                <h2 className="text-4xl font-bold">Comprehensive Safety Systems</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Multiple redundant safety systems ensure that our facilities operate with zero risk. From automated
                  shutdown mechanisms to passive cooling systems, every aspect is designed with safety as the paramount
                  concern.
                </p>
                <div className="pt-4">
                  
                </div>
              </div>
            </GSAPScrollAnimation>
          </div>

          {/* Section 3: Waste Management - 3D Model */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <GSAPScrollAnimation animationType="fadeInLeft" delay={0.2}>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase">Sustainability</p>
                <h2 className="text-4xl font-bold">Waste Management Process</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  We employ cutting-edge waste management techniques that minimize environmental impact. Our commitment
                  to sustainability extends beyond energy production to responsible handling of all byproducts.
                </p>
                <div className="pt-4">
                  
                </div>
              </div>
            </GSAPScrollAnimation>

            <GSAPScrollAnimation animationType="fadeInRight" delay={0.2}>
              <div className="relative w-full h-full">
                <Image
                  src="/pictures/waste.jpg"
                  alt="Waste management process"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-xl border border-border object-cover"
                />
              </div>
            </GSAPScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <GSAPScrollAnimation animationType="fadeInUp">
            <h2 className="text-4xl font-bold">Ready to Join the Energy Revolution?</h2>
          </GSAPScrollAnimation>
          <GSAPScrollAnimation animationType="fadeInUp" delay={0.1}>
            <p className="text-lg opacity-90">
              Get in touch with our team to learn more about ATOMi and how we're transforming Rwanda's energy future.
            </p>
          </GSAPScrollAnimation>
          <GSAPScrollAnimation animationType="fadeInUp" delay={0.2}>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </GSAPScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  )
}
