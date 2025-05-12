import { Product } from '@/types'

// selected types I need
export type ApiProductResponse = {
  products: {
    id: string
    title: string
    images: string[]
    description: string
  }[]
  total: number
  skip: number
  limit: number
}

export type ProductResponse = {
  products: Omit<Product, 'variants'>[]
  total: number
  skip: number
  limit: number
}
