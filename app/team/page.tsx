"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Mail, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  email: string
  image_url?: string
  linkedin_url?: string
  order_index: number
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .order("order_index", { ascending: true })

        if (error) throw error
        setMembers(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team members")
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <h1 className="text-5xl font-bold mb-4">Our Team</h1>
            <p className="text-lg text-foreground/70">Meet the experts driving Rwanda's nuclear energy revolution</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Introduction */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="space-y-4 text-center mb-20">
              <h2 className="text-3xl font-bold">Dedicated to Excellence</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Our team brings together world-class expertise in nuclear engineering, energy policy, and sustainable
                development. With decades of combined experience across the globe, we're committed to making nuclear
                energy accessible and safe for Rwanda and all of Africa.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 flex-1">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 100} direction="up">
                  <div 
                    className="bg-background rounded-xl overflow-hidden border border-border hover:border-foreground/20 transition-all duration-300 group h-full flex flex-col cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* Image */}
                    <div className="bg-muted h-64 flex items-center justify-center overflow-hidden relative">
                      {member.image_url ? (
                        <img src={member.image_url || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <p className="text-foreground/30 text-sm">Team Member Photo</p>
                      )}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{member.role}</p>
                        <p className="text-sm text-foreground/70 line-clamp-3 mt-3">{member.bio}</p>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-col space-y-3 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors w-full"
                        >
                          <Mail size={16} className="flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors w-full"
                          >
                            <Linkedin size={16} className="flex-shrink-0" />
                            <span>LinkedIn Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "We continuously push the boundaries of nuclear technology to create safer, more efficient solutions.",
              },
              {
                title: "Safety First",
                description:
                  "Every decision we make prioritizes the safety of our team, communities, and the environment.",
              },
              {
                title: "Sustainability",
                description: "We're committed to building a clean energy future that benefits generations to come.",
              },
            ].map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 100} direction="up">
                <div className="bg-background rounded-xl p-8 border border-border hover:border-foreground/20 transition-colors">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full Description Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  {selectedMember.image_url && (
                    <img
                      src={selectedMember.image_url}
                      alt={selectedMember.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                    <DialogDescription className="text-base mt-1">{selectedMember.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{selectedMember.bio}</p>
                </div>
                <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Mail size={16} className="flex-shrink-0" />
                    <span>{selectedMember.email}</span>
                  </a>
                  {selectedMember.linkedin_url && (
                    <a
                      href={selectedMember.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Linkedin size={16} className="flex-shrink-0" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
