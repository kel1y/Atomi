import { createClient } from "@/lib/supabase/server"

export async function getBlogPosts(published?: boolean) {
  const supabase = await createClient()

  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (published !== undefined) {
    query = query.eq("published", published)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function generateUniqueSlug(baseTitle: string) {
  const supabase = await createClient()
  const base = slugify(baseTitle)
  if (!base) return String(Date.now())

  // Find existing slugs that match base or base-<number>
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .ilike("slug", `${base}%`)

  if (!data || data.length === 0) return base

  const existing = new Set(data.map((r) => r.slug))
  if (!existing.has(base)) return base

  let suffix = 2
  while (existing.has(`${base}-${suffix}`)) suffix++
  return `${base}-${suffix}`
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) throw error
  return data
}

export async function createBlogPost(post: {
  title: string
  slug?: string
  excerpt: string
  content: string
  author: string
  category: string
  photo_url?: string
  published?: boolean
}) {
  const supabase = await createClient()
  const slug = post.slug && post.slug.trim().length > 0 ? post.slug : await generateUniqueSlug(post.title)
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([
      {
        ...post,
        slug,
        published: post.published ?? false,
        likes_count: 0,
        comments_count: 0,
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateBlogPost(
  id: string,
  post: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    author?: string
    category?: string
    photo_url?: string
    published?: boolean
  },
) {
  const supabase = await createClient()
  let update = { ...post } as typeof post & { slug?: string }
  if ((post.slug === undefined || post.slug === "") && post.title) {
    // When slug omitted/cleared, regenerate from title
    update.slug = await generateUniqueSlug(post.title)
  }
  const { data, error } = await supabase.from("blog_posts").update(update).eq("id", id).select()

  if (error) throw error
  return data?.[0]
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) throw error
}
