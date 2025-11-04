import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"

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

interface BlogCardProps {
  post: BlogPost
  variant?: "grid" | "list"
}

export function BlogCard({ post, variant = "grid" }: BlogCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  if (variant === "list") {
    return (
      <article className="bg-background rounded-xl overflow-hidden border border-border hover:border-foreground/20 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-muted rounded-lg h-48 md:h-auto flex items-center justify-center overflow-hidden">
            {post.photo_url ? (
              <img src={post.photo_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <p className="text-foreground/30 text-sm">Post Image</p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{post.category}</p>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold hover:text-foreground/70 transition-colors">{post.title}</h2>
              </Link>
              <p className="text-foreground/70">{post.excerpt}</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center text-sm text-foreground/60 pt-4 border-t border-border">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formattedDate}</span>
              <div className="flex gap-4 ml-auto">
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  <span>{post.comments_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-background rounded-xl overflow-hidden border border-border hover:border-foreground/20 transition-colors group cursor-pointer h-full flex flex-col">
        <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
          {post.photo_url ? (
            <img src={post.photo_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <p className="text-foreground/30 text-sm">Post Image</p>
          )}
        </div>
        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{post.category}</p>
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-foreground/70 transition-colors">
              {post.title}
            </h3>
            <p className="text-foreground/70 text-sm line-clamp-2 mt-2">{post.excerpt}</p>
          </div>

          <div className="flex justify-between items-center text-xs text-foreground/50 pt-4 border-t border-border">
            <span>{formattedDate}</span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{post.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
