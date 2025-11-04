"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "@/components/image-upload"
import { uploadImage } from "@/lib/supabase/storage"
import { useRef } from "react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  photo_url?: string
  published: boolean
  created_at: string
  likes_count: number
  comments_count: number
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Energy",
    photo_url: "",
    published: false,
  })

  // For inserting images into the content field
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)

  const triggerInsertImage = () => fileInputRef.current?.click()

  const handleInsertImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingContentImage(true)
    try {
      const url = await uploadImage(file, "blog-images")
      const alt = file.name.replace(/\.[^.]+$/, "")
      const markdown = `![${alt}](${url})`

      // Insert at cursor position in the textarea
      const textarea = contentRef.current
      if (textarea) {
        const start = textarea.selectionStart || 0
        const end = textarea.selectionEnd || 0
        const before = formData.content.slice(0, start)
        const after = formData.content.slice(end)
        const insert = (before.endsWith("\n") || before.length === 0 ? "" : "\n\n") + markdown + "\n\n"
        const newContent = before + insert + after
        setFormData({ ...formData, content: newContent })
        // restore cursor after insertion
        requestAnimationFrame(() => {
          const pos = (before + insert).length
          textarea.setSelectionRange(pos, pos)
          textarea.focus()
        })
      } else {
        // Fallback: append to the end
        setFormData({ ...formData, content: (formData.content ? formData.content + "\n\n" : "") + markdown + "\n\n" })
      }
    } finally {
      setUploadingContentImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const supabase = createClient()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts")
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
          .from("blog_posts")
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            category: formData.category,
            photo_url: formData.photo_url,
            published: formData.published,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("blog_posts").insert([
          {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            category: formData.category,
            photo_url: formData.photo_url,
            published: formData.published,
            likes_count: 0,
            comments_count: 0,
          },
        ])

        if (error) throw error
      }

      await loadPosts()
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        category: "Energy",
        photo_url: "",
        published: false,
      })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      photo_url: post.photo_url || "",
      published: post.published,
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      setError(null)
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blog Posts</h1>
          <p className="text-foreground/70">Manage your blog content</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} />
          New Post
        </Button>
      </div>

      {/* Error Message */}
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      {/* Form */}
      {showForm && (
        <Card className="p-6 bg-background border border-border">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Post" : "Create New Post"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              bucket="blog-images"
              onUploadComplete={(url) => setFormData({ ...formData, photo_url: url })}
              currentImage={formData.photo_url}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value
                    // Auto-suggest slug only if slug field is empty
                    const autoSlug = title
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                    setFormData({ ...formData, title, slug: formData.slug ? formData.slug : autoSlug })
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="auto-generated if left blank"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Content</label>
                <button
                  type="button"
                  onClick={triggerInsertImage}
                  className="text-sm px-2 py-1 rounded-md border border-border hover:bg-muted flex items-center gap-1"
                >
                  {uploadingContentImage ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon size={14} />
                      Insert image
                    </>
                  )}
                </button>
              </div>
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y min-h-40"
                required
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInsertImageFile}
                className="hidden"
              />
              <p className="mt-2 text-xs text-foreground/60">Tip: Images are inserted as Markdown. You can add alt text by editing inside ![...](...).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                >
                  <option>Energy</option>
                  <option>Safety</option>
                  <option>Policy</option>
                  <option>Research</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-border"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 size={16} className="animate-spin mr-2" />}
                {editingId ? "Update Post" : "Create Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    title: "",
                    slug: "",
                    excerpt: "",
                    content: "",
                    author: "",
                    category: "Energy",
                    photo_url: "",
                    published: false,
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Posts Table */}
      <Card className="bg-background border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            <p className="text-foreground/70">Loading posts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Engagement</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium line-clamp-1">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{post.author}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-muted text-foreground/70 text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.published ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {post.likes_count} likes, {post.comments_count} comments
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
