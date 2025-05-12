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
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(30, { message: 'Description must be at most 30 characters' }),
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

export type ProductFormSchemmaTypes = z.infer<typeof productSchema>
