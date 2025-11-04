"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Comment {
  id: string
  post_id: string
  content: string
  author_name: string
  author_email: string
  approved: boolean
  created_at: string
  post_title?: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("blog_comments")
        .select(
          `
          *,
          blog_posts:post_id(title)
        `,
        )
        .order("created_at", { ascending: false })

      if (error) throw error

      // Map the data to include post_title
      const mappedData = (data || []).map((comment: any) => ({
        ...comment,
        post_title: comment.blog_posts?.title || "Unknown Post",
      }))

      setComments(mappedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  const filteredComments = comments.filter((comment) => {
    if (filter === "approved") return comment.approved
    if (filter === "pending") return !comment.approved
    return true
  })

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_comments").update({ approved: true }).eq("id", id)

      if (error) throw error
      await loadComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve comment")
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const { error } = await supabase.from("blog_comments").delete().eq("id", id)

      if (error) throw error
      await loadComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Comments</h1>
        <p className="text-foreground/70">Moderate and manage blog comments</p>
      </div>

      {/* Error Message */}
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      {/* Filter Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all" ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          All ({comments.length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "approved" ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Approved ({comments.filter((c) => c.approved).length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "pending" ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Pending ({comments.filter((c) => !c.approved).length})
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            <p className="text-foreground/70">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <Card className="p-12 bg-background border border-border text-center">
            <p className="text-foreground/60">No comments to display</p>
          </Card>
        ) : (
          filteredComments.map((comment) => (
            <Card key={comment.id} className="p-6 bg-background border border-border">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{comment.author_name}</h3>
                    <p className="text-sm text-foreground/60">{comment.author_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-foreground/60">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs font-medium text-foreground/70 mt-1">
                      On: <span className="line-clamp-1">{comment.post_title}</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-foreground/80 bg-muted/30 rounded-lg p-4">{comment.content}</p>

                {/* Status & Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div>
                    {comment.approved ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        Pending Review
                      </span>
                    )}
                  </div>

                  {!comment.approved && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(comment.id)}
                        size="sm"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Check size={16} />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(comment.id)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <X size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
