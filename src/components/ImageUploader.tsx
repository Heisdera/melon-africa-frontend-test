'use client'

import { Button } from '@/components/ui/button'
import { useImageUpload } from '@/hooks/use-image-upload'
import { cn } from '@/lib/utils'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface ImageUploaderProps {
  previewUrl: string | null
  onImageChange: (base64String: string | null) => void
  errorMessage?: string
}

export default function ImageUploader({
  previewUrl,
  onImageChange,
  errorMessage,
}: ImageUploaderProps) {
  const {
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    localImageUploadError,
    setLocalImageUploadError,
  } = useImageUpload({ onImageChange, previewUrl })

  useEffect(() => {
    if (errorMessage && setLocalImageUploadError) {
      setLocalImageUploadError(null)
    }
  }, [errorMessage, setLocalImageUploadError])

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'relative flex',
          'rounded-3xl border-2 border-dashed p-[1px]',
          isDragging ? 'border-zinc-400' : 'border-transparent'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button
          type="button"
          id="profile-photo"
          variant="outline"
          className={cn(
            'group focus-visible:ring-primary relative flex aspect-square size-48 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-[3px] border-zinc-300 font-normal hover:border-dashed hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-black md:size-56'
          )}
          onClick={handleThumbnailClick}
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
        >
          {previewUrl ? (
            <Image
              className="h-full w-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              fill
            />
          ) : (
            <div className="w-/5 mx-auto space-y-3" aria-hidden="true">
              <Upload className="mx-auto size-6 text-zinc-400" />

              <p className="text-center text-sm leading-relaxed text-wrap whitespace-normal text-zinc-500">
                Drag & drop or click to upload
              </p>
            </div>
          )}
        </Button>

        {previewUrl && (
          <Button
            onClick={handleRemove}
            size="icon"
            variant="destructive"
            className="border-background focus-visible:ring-primary absolute -top-1.5 -right-1.5 size-6 rounded-full border-2 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-black"
            aria-label="Remove image"
          >
            <X size={16} />
          </Button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload image file"
        />
      </div>

      <div>
        {errorMessage && localImageUploadError && (
          <div className="bg-red-18 flex items-center justify-center text-xs text-red-500 md:text-sm">
            {localImageUploadError}
          </div>
        )}
        {localImageUploadError && !errorMessage && (
          <div className="bg-red-18 flex items-center justify-center text-xs text-red-500 md:text-sm">
            {localImageUploadError}
          </div>
        )}
        {errorMessage && !localImageUploadError && (
          <div className="bg-red-18 flex items-center justify-center text-xs text-red-500 md:text-sm">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
