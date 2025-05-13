import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// add product schema
export const productSchema = z.object({
  title: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  image: z.string().min(2, { message: 'Please upload an image' }),
})

// image schema
export const imageSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please upload an image' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    })
    .refine((file) => file.size <= MAX_IMAGE_FILE_SIZE, {
      message: 'File size exceeds 2MB',
    }),
})

export type ProductFormSchemaTypes = z.infer<typeof productSchema>

// Form schema
export const variantSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters' }),
  size: z.string().min(1, { message: 'Please select a size' }),
  color: z.string().min(1, { message: 'Please select a color' }),
  price: z.coerce
    .number()
    .positive({ message: 'Price must be a positive number' }),
  stock: z.coerce
    .number()
    .int()
    .min(1, { message: 'Stock must be at least 1 item' }),
})

export type VariantFormSchemaType = z.infer<typeof variantSchema>
