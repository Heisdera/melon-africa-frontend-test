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
  const { setImage } = useImageUploadStore()
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
    // Update the product with new data
    const updatedProduct = {
      ...product,
      title: data.title,
      description: data.description,
      image: data.image,
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

              <Button type="submit" disabled={isSubmitting}>
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
