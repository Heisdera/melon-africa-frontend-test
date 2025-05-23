'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateId } from '@/lib/utils'
import { VariantFormSchemaType, variantSchema } from '@/schemas'
import type { Variant } from '@/types'
import {
  useAddVariantMutation,
  useEditVariantMutation,
} from '@/utils/mutations'

interface VariantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: Variant | null
  productId: string
}

export function VariantModal({
  open,
  onOpenChange,
  variant,
  productId,
}: VariantDialogProps) {
  const { mutate: updateVariant, isPending: isUpdatePending } =
    useEditVariantMutation()
  const { mutate: addVariant, isPending: isAddPending } =
    useAddVariantMutation()

  const isLoading = isUpdatePending || isAddPending

  const form = useForm<VariantFormSchemaType>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      id: variant?.id || '',
      title: variant?.name || '',
      sku: variant?.sku || '',
      size: variant?.size || '',
      color: variant?.color || '',
      price: variant?.price || 0,
      stock: variant?.stock || 0,
    },
  })

  // Reset form when dialog opens/closes or variant changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: variant?.id || '',
        title: variant?.name || '',
        sku: variant?.sku || '',
        size: variant?.size || '',
        color: variant?.color || '',
        price: variant?.price || 0,
        stock: variant?.stock || 0,
      })
    }
  }, [open, variant, form])

  // Handle form submission
  const onSubmit = (values: VariantFormSchemaType) => {
    const variantData: Variant = {
      id: values.id || generateId(),
      productId: variant?.productId || productId,
      name: values.title,
      sku: values.sku,
      size: values.size || '',
      color: values.color || '',
      price: values.price,
      stock: values.stock,
    }

    if (variant) {
      updateVariant(variantData, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    } else {
      addVariant(variantData, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    }
  }

  // Check if form has any changes
  const isDirty = form.formState.isDirty
  // For new variants, we don't need the dirty check
  const isDisabled = isLoading || (!!variant && !isDirty)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{variant ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
          <DialogDescription>
            {variant
              ? 'Update the details of your product variant.'
              : 'Add a new variant to your product.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Variant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem className="h-fit">
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SHIRT-BLACK-XL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="h-fit">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="h-fit">
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="h-fit">
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="1"
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isDisabled}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {variant ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
