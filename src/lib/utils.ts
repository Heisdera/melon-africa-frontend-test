import { PRODUCTS_KEY } from '@/constants'
import type { Product, Variant } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useScroll() {
  const [isScrolling, setIsScrolling] = useState(false)

  function navScroll() {
    if (window.scrollY > 20) {
      setIsScrolling(true)
    } else {
      setIsScrolling(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', navScroll)

    return () => {
      window.removeEventListener('scroll', navScroll)
    }
  }, [])

  return { isScrolling }
}

// Generate a random ID for a new product
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Convert Base64String to File
export const convertBase64StringToFile = (
  base64String: string,
  filename: string
) => {
  const [mimeType, base64Data] = base64String.split(';base64,')

  const byteCharacters = atob(base64Data)

  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  const blob = new Blob([byteArray], { type: mimeType })

  const file = new File([blob], filename, { type: mimeType })

  return file
}

// Helper to get products from localStorage
export const getProducts = async (): Promise<Product[]> => {
  if (typeof window === 'undefined') return []

  const storedProducts = localStorage.getItem(PRODUCTS_KEY)
  return storedProducts ? JSON.parse(storedProducts) : []
}

// Helper to save products to localStorage
const saveProducts = async (products: Product[]): Promise<void> => {
  if (typeof window === 'undefined') return

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

// Add a new product
export const addProduct = async (product: Product): Promise<Product> => {
  const products = await getProducts()
  const newProducts = [...products, { ...product, variants: [] }]
  await saveProducts(newProducts)
  return product
}

// Update an existing product
export const updateProduct = async (product: Product): Promise<Product> => {
  const products = await getProducts()
  const existingProduct = products.find((p) => p.id === product.id)

  if (!existingProduct) {
    throw new Error(`Product with ID ${product.id} not found`)
  }

  const updatedProducts = products.map((p) =>
    p.id === product.id ? { ...product, variants: p.variants } : p
  )

  await saveProducts(updatedProducts)
  return product
}

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  const products = await getProducts()
  const updatedProducts = products.filter((p) => p.id !== productId)
  await saveProducts(updatedProducts)
}

// Add a variant to a product
export const addVariant = async (variant: Variant): Promise<Variant> => {
  const products = await getProducts()
  const productIndex = products.findIndex((p) => p.id === variant.productId)

  if (productIndex === -1) {
    throw new Error(`Product with ID ${variant.productId} not found`)
  }

  const updatedProducts = [...products]
  updatedProducts[productIndex] = {
    ...updatedProducts[productIndex],
    variants: [...updatedProducts[productIndex].variants, variant],
  }

  await saveProducts(updatedProducts)
  return variant
}

// Update a variant
export const updateVariant = async (variant: Variant): Promise<Variant> => {
  const products = await getProducts()
  const productIndex = products.findIndex((p) => p.id === variant.productId)

  if (productIndex === -1) {
    throw new Error(`Product with ID ${variant.productId} not found`)
  }

  const variantIndex = products[productIndex].variants.findIndex(
    (v) => v.id === variant.id
  )

  if (variantIndex === -1) {
    throw new Error(`Variant with ID ${variant.id} not found`)
  }

  const updatedProducts = [...products]
  const updatedVariants = [...updatedProducts[productIndex].variants]
  updatedVariants[variantIndex] = variant

  updatedProducts[productIndex] = {
    ...updatedProducts[productIndex],
    variants: updatedVariants,
  }

  await saveProducts(updatedProducts)
  return variant
}

// Delete a variant
export const deleteVariant = async (variantId: string): Promise<void> => {
  const products = await getProducts()

  const updatedProducts = [...products]

  for (let i = 0; i < updatedProducts.length; i++) {
    const variantIndex = updatedProducts[i].variants.findIndex(
      (v) => v.id === variantId
    )

    if (variantIndex !== -1) {
      updatedProducts[i] = {
        ...updatedProducts[i],
        variants: updatedProducts[i].variants.filter((v) => v.id !== variantId),
      }
      break
    }
  }

  await saveProducts(updatedProducts)
}
