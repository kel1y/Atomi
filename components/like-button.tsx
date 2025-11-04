"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialLikes: number
}

export function LikeButton({ postId, initialLiked, initialLikes }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked)
  const [likes, setLikes] = useState<number>(initialLikes)
  const [busy, setBusy] = useState<boolean>(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setIsLiked(initialLiked)
    setLikes(initialLikes)
  }, [initialLiked, initialLikes])

  const handleToggleLike = async () => {
    if (busy) return
    setBusy(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!isLiked) {
        const { error } = await supabase.from("blog_likes").insert([{ post_id: postId, user_id: user.id }])
        if (error) throw error
        setIsLiked(true)
        setLikes((v) => v + 1)
      } else {
        const { error } = await supabase.from("blog_likes").delete().eq("post_id", postId).eq("user_id", user.id)
        if (error) throw error
        setIsLiked(false)
        setLikes((v) => Math.max(0, v - 1))
      }
    } catch (err) {
      // Optionally show toast here
      console.error("Failed to update like:", err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button variant={isLiked ? "default" : "outline"} onClick={handleToggleLike} disabled={busy} className="flex items-center gap-2">
      {busy ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isLiked ? "currentColor" : "none"} />}
      <span>{likes}</span>
    </Button>
  )
}



