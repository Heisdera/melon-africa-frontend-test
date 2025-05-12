export interface Product {
  id: string
  name: string
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
