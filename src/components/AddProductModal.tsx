'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { generateId } from '@/lib/utils'
import { ProductFormSchemmaTypes, productSchema } from '@/schemas'
import { useImageUploadStore } from '@/store/image-upload-store'
import { useAddProductMutation } from '@/utils/mutations'
import { useState } from 'react'
import ImageUploader from './ImageUploader'

export function AddProductModal({ children }: { children?: React.ReactNode }) {
  const { setImage } = useImageUploadStore()
  const [open, setOpen] = useState(false)
  const { mutate: addProduct, isPending } = useAddProductMutation()

  const form = useForm<ProductFormSchemmaTypes>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
    },
  })

  const onSubmit = async (data: ProductFormSchemmaTypes) => {
    // Create a new product with a generated ID
    const newProduct = {
      id: generateId(),
      title: data.title,
      description: data.description,
      image: data.image,
      variants: [],
    }

    // Add product to local storage via mutation
    addProduct(newProduct, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  const handleClose = (open: boolean) => {
    setOpen(open)

    // Reset form when modal closes
    form.reset()
  }
  const isSubmitting = form.formState.isSubmitting || isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose(open)
        } else {
          setOpen(open)
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children ? (
          children
        ) : (
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory.
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
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
