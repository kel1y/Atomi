import { createClient } from "@/lib/supabase/client"

export async function uploadImage(file: File, bucket: "blog-images" | "team-images"): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const filename = `${timestamp}-${random}-${file.name}`

  const { data, error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw error

  // Get public URL
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return publicData.publicUrl
}

export async function deleteImage(path: string, bucket: "blog-images" | "team-images"): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) throw error
}
