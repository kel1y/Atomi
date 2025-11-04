"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "@/components/ui/use-toast"

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  email: string
  image_url?: string
  linkedin_url?: string
  created_at: string
  order_index: number
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    image_url: "",
    linkedin_url: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("team_members").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
            email: formData.email,
            image_url: formData.image_url,
            linkedin_url: formData.linkedin_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error
        toast({ title: "Member updated", description: `${formData.name} has been updated.` })
      } else {
        const { error } = await supabase.from("team_members").insert([
          {
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
            email: formData.email,
            image_url: formData.image_url,
            linkedin_url: formData.linkedin_url,
            order_index: members.length,
          },
        ])

        if (error) throw error
        toast({ title: "Member added", description: `${formData.name} has been added.` })
      }

      await loadMembers()
      setFormData({ name: "", role: "", bio: "", email: "", image_url: "", linkedin_url: "" })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save team member"
      setError(message)
      toast({ title: "Save failed", description: message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      email: member.email,
      image_url: member.image_url || "",
      linkedin_url: member.linkedin_url || "",
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      setError(null)
      const { error } = await supabase.from("team_members").delete().eq("id", id)

      if (error) throw error
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team member")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Team Members</h1>
          <p className="text-foreground/70">Manage your team directory</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} />
          Add Member
        </Button>
      </div>

      {/* Error Message */}
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      {/* Form */}
      {showForm && (
        <Card className="p-6 bg-background border border-border">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Member" : "Add Team Member"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              bucket="team-images"
              onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
              currentImage={formData.image_url}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 size={16} className="animate-spin mr-2" />}
                {editingId ? "Update Member" : "Add Member"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ name: "", role: "", bio: "", email: "", image_url: "", linkedin_url: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Team Grid */}
      {loading ? (
        <div className="p-8 text-center">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          <p className="text-foreground/70">Loading team members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="p-6 bg-background border border-border">
              <div className="space-y-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-foreground/30 text-xs">No Photo</p>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-foreground/60 mb-2">{member.role}</p>
                  <p className="text-sm text-foreground/70 line-clamp-2">{member.bio}</p>
                </div>

                {/* Email */}
                <p className="text-xs text-foreground/60 border-t border-border pt-4">{member.email}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
