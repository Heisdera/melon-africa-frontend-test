export interface Product {
  id: string
  title: string
  image: string
  description: string
  variants: Variant[]
}

export interface Variant {
  id: string
  productId: string
  name: string
  sku: string
  size: string
  color: string
  price: number
  stock: number
}

export type ProductCategoryType = { text: string; link: string }
