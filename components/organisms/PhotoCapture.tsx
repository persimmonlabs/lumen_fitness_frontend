'use client'

import { useRef, useState } from "react"
import { Button } from "@/components/atoms/Button"
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { uploadImage } from "@/lib/api"

interface PhotoCaptureProps {
  onPhotoCapture: (url: string, thumbnailUrl: string) => void
  onCancel: () => void
}

export function PhotoCapture({ onPhotoCapture, onCancel }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const result = await uploadImage(file)
      onPhotoCapture(result.url, result.thumbnail_url)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-ocean-900">
        <h2 className="text-lg font-semibold">Capture Meal</h2>
        <button onClick={onCancel} className="p-2">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative bg-ocean-950">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
        ) : (
          <div className="flex items-center justify-center h-full text-ocean-400">
            <p>Camera preview placeholder</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-ocean-900">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          size="lg"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : <CameraIcon className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  )
}
