"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadImage } from "@/lib/supabase/storage"

interface ImageUploadProps {
  bucket: "blog-images" | "team-images"
  onUploadComplete: (url: string) => void
  currentImage?: string
}

export function ImageUpload({ bucket, onUploadComplete, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keep preview in sync when the caller changes currentImage (e.g., when editing a different member)
  useEffect(() => {
    setPreview(currentImage || null)
  }, [currentImage])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const url = await uploadImage(file, bucket)
      onUploadComplete(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Photo</label>

      {preview ? (
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-foreground/50 mb-2" />
              <p className="text-sm text-foreground/50">Uploading...</p>
            </>
          ) : (
            <>
              <Upload size={24} className="text-foreground/50 mb-2" />
              <p className="text-sm text-foreground/70">Click to upload image</p>
              <p className="text-xs text-foreground/50">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
