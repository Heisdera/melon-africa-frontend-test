'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchemaTypes, productSchema } from '@/schemas'
import { useImageUploadStore } from '@/store/image-upload-store'
import type { Product } from '@/types'
import { useEditProductMutation } from '@/utils/mutations'
import ImageUploader from './ImageUploader'
import { convertBase64StringToFile } from '@/lib/utils'

// Helper function to check if a string is a base64 image
const isBase64Image = (str: string): boolean => {
  // Check if string starts with data:image format
  return str?.startsWith('data:image/') || false
}

interface EditProductModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductModal({
  product,
  open,
  onOpenChange,
}: EditProductModalProps) {
  const { setImage, fileName } = useImageUploadStore()
  const { mutate: editProduct, isPending } = useEditProductMutation()

  const form = useForm<ProductFormSchemaTypes>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      image: product.image,
    },
  })

  // Update form values when product changes
  useEffect(() => {
    form.reset({
      title: product.title,
      description: product.description,
      image: product.image,
    })
  }, [product, form])

  const onSubmit = async (data: ProductFormSchemaTypes) => {
    let imageUrl = data.image
    let imagePublicId = product.imagePublicId

    // Only process image upload if it's a base64 string (new image)
    if (isBase64Image(data.image)) {
      try {
        // If replacing an existing image, delete the old one first
        if (product.imagePublicId) {
          try {
            await fetch('/api/image/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ public_id: product.imagePublicId }),
            })
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError)
            // Continue with upload even if deletion fails
          }
        }

        const file = convertBase64StringToFile(data.image, fileName)

        if (!file) {
          throw new Error('Failed to convert base64 to file')
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/image/upload', {
          method: 'POST',
          body: formData,
        })

        const result: { secure_url: string; public_id: string } =
          await response.json()
        if (!result) {
          throw new Error('Failed to upload file')
        }

        // Use the newly uploaded image URL and public_id
        imageUrl = result.secure_url
        imagePublicId = result.public_id
      } catch (error) {
        console.error('Image upload error:', error)
        // Continue with the original image if upload fails
      }
    }

    // Update the product with new data
    const updatedProduct = {
      ...product,
      title: data.title,
      description: data.description,
      image: imageUrl,
      imagePublicId: imagePublicId,
    }

    // Update product in local storage via mutation
    editProduct(updatedProduct, {
      onSuccess: () => {
        onOpenChange(false)
        form.reset()
      },
    })
  }

  const handleClose = (open: boolean) => {
    onOpenChange(open)

    // Reset form when modal closes
    if (!open) {
      form.reset()
    }
  }

  const isSubmitting = form.formState.isSubmitting || isPending

  // Check if form has any changes
  const isDirty = form.formState.isDirty
  const isDisabled = isSubmitting || !isDirty

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        handleClose(open)
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update your product information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="mt-1 mb-4 flex h-40 w-full flex-col items-center justify-center gap-2 bg-zinc-100 text-center md:h-50">
                      <ImageUploader
                        previewUrl={field.value}
                        onImageChange={(base64String) => {
                          field.onChange(base64String)
                          setImage(base64String)
                        }}
                        errorMessage={fieldState.error?.message}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      className="max-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isDisabled}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
