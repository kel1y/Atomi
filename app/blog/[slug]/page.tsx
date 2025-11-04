import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlogComments } from "@/components/blog-comments"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { LikeButton } from "@/components/like-button"

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (postError || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post not found</h1>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Very small markdown-to-HTML converter for images, links, and paragraphs
  const escapeHtml = (str: string) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
  const renderMarkdown = (md: string) => {
    // Normalize Windows/mac line endings first
    const normalized = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    const escaped = escapeHtml(normalized)
    // images ![alt](url)
    const withImages = escaped.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_m, alt, url) => `<img src="${url}" alt="${alt}" class="my-6 max-w-full rounded-lg" />`,
    )
    // links [text](url)
    const withLinks = withImages.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
    // paragraphs: split by two or more newlines
    // Split on two or more newlines to form paragraphs
    const paragraphs = withLinks
      .split(/\n{2,}/g)
      .map((block) => `<p class="mb-5 leading-relaxed">${block.replaceAll("\n", "<br/>")}</p>`) // keep single newlines as <br>
      .join("")
    return paragraphs
  }

  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .neq("id", post.id)
    .limit(3)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: existingLike } = user
    ? await supabase.from("blog_likes").select("id").eq("post_id", post.id).eq("user_id", user.id).maybeSingle()
    : { data: null }

  const isLiked = Boolean(existingLike)
  const likes = post.likes_count

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Button>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase">{post.category}</p>
            <h1 className="text-5xl font-bold">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-foreground/60 border-t border-b border-border py-4">
              <span>{post.author}</span>
              <span>•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto bg-muted rounded-xl h-96 flex items-center justify-center border border-border overflow-hidden">
          {post.photo_url ? (
            <img src={post.photo_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <p className="text-foreground/30">Featured Image</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Main Content full width so comments aren't squeezed */}
          <div className="space-y-6">
            <article className="prose prose-invert max-w-none">
              <div className="text-lg text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
            </article>

            <div className="flex gap-4 pt-8 border-t border-border">
              <LikeButton postId={post.id} initialLiked={isLiked} initialLikes={likes} />
            </div>

            <section className="pt-12 border-t border-border">
              <BlogComments postId={post.id} />
            </section>
          </div>

          {/* Optional related links below without heading word */}
          {(relatedPosts || []).length > 0 && (
            <div className="mt-16 space-y-3">
              {(relatedPosts || []).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block p-3 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted/30 transition-colors group"
                >
                  <h4 className="text-sm font-medium group-hover:text-foreground/80 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-xs text-foreground/60 mt-1">
                    {new Date(relatedPost.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
