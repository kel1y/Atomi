"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-foreground/70">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <ScrollReveal direction="left">
                <div>
                  <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                </div>
              </ScrollReveal>

              {/* Email */}
              <ScrollReveal direction="left" delay={100}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:kelly@atomi.rw"
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      info@atomi.rw
                    </a>
                    <p className="text-xs text-foreground/50 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Phone */}
              <ScrollReveal direction="left" delay={200}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+250794106481" className="text-foreground/70 hover:text-foreground transition-colors">
                      +250 (0) 794106481
                    </a>
                    <p className="text-xs text-foreground/50 mt-1">Monday - Friday, 9am - 5pm</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Address */}
              <ScrollReveal direction="left" delay={300}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-foreground/70">Kigali, Rwanda</p>
                    <p className="text-xs text-foreground/50 mt-1">East Africa Regional Office</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Hours */}
              <ScrollReveal direction="left" delay={400}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-foreground/70 text-sm">Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p className="text-foreground/70 text-sm">Sat - Sun: Closed</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="right">
                <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-xl p-8 border border-border">
                <h2 className="text-2xl font-bold">Send us a Message</h2>

                {submitted && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-xs text-foreground/60 text-center">
                  We respect your privacy. Your information will only be used to respond to your inquiry.
                </p>
              </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              {
                q: "How long does it take to get a response?",
                a: "We typically respond to inquiries within 24 business hours. For urgent matters, please call our office directly.",
              },
              {
                q: "What are your office hours?",
                a: "We're open Monday through Friday, 9:00 AM to 5:00 PM East Africa Time. We're closed on weekends and public holidays.",
              },
              {
                q: "Can I schedule a site visit?",
                a: "Yes! Site visits can be arranged by contacting our office. Please allow at least 2 weeks notice for scheduling.",
              },
              {
                q: "Do you offer internships or job opportunities?",
                a: "We're always looking for talented individuals. Please send your resume and inquiry to info@atomi.rw.",
              },
            ].map((faq, index) => (
              <ScrollReveal key={index} delay={index * 100} direction="up">
                <details className="group bg-background rounded-lg border border-border p-6 hover:border-foreground/20 transition-colors cursor-pointer">
                  <summary className="flex justify-between items-center font-semibold">
                    {faq.q}
                    <span className="text-foreground/60 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-foreground/70 mt-4">{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
