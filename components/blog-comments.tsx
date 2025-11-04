"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, MessageCircle } from "lucide-react"

interface Comment {
  id: string
  content: string
  author_name: string
  author_email: string
  approved: boolean
  created_at: string
}

interface BlogCommentsProps {
  postId: string
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    author_name: "",
    content: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadComments()
    checkUser()
  }, [postId])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    // Do not prefill the name with any example; let user type their preferred display name
  }

  const loadComments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", postId)
        .eq("approved", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Check if user is authenticated
    if (!user) {
      router.push("/auth/login")
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.from("blog_comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          author_name: formData.author_name,
          author_email: user.email,
          content: formData.content,
          approved: false,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setFormData({ author_name: formData.author_name, content: "" })

      // Reload comments after a short delay
      setTimeout(() => {
        loadComments()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MessageCircle size={24} />
          Comments
        </h2>
        <p className="text-foreground/70">Join the discussion</p>
      </div>

      {/* Comment Form */}
      <Card className="p-6 bg-background border border-border">
        <h3 className="text-lg font-semibold mb-4">{user ? "Leave a comment" : "Sign in to comment"}</h3>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-foreground/70 mb-4">You need to be signed in to comment</p>
            <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                required
              />
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}
            {success && (
              <div className="p-3 bg-green-500/10 text-green-700 rounded-lg text-sm">
                Comment submitted! It will appear after approval.
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 size={16} className="animate-spin mr-2" />}
              Post Comment
            </Button>
          </form>
        )}
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            <p className="text-foreground/70">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-8 bg-muted/30 border border-border text-center">
            <p className="text-foreground/70">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6 bg-background border border-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{comment.author_name}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-foreground/80">{comment.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
