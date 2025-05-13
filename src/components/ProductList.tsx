'use client'

import { Loader2, Plus } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useAddProductMutation } from '@/utils/mutations'
import { useCategories, useProducts } from '@/utils/queries'
import { dummyCategories } from '@/data'
import { generateId } from '@/lib/utils'

export const ProductsList = () => {
  const searchParams = useSearchParams()
  const { data: categoriesResponse } = useCategories()
  const currentCategory = searchParams.get('category') || 'all'
  const { data, isLoading, error } = useProducts(currentCategory)
  const { mutate: addProduct, isPending } = useAddProductMutation()

  const products = data?.data?.products || []

  const categories = categoriesResponse?.data || dummyCategories

  const activeCollectionIndex = categories?.findIndex(
    (category) => category.link === currentCategory
  )

  const category =
    activeCollectionIndex !== -1
      ? categories[activeCollectionIndex].text
      : currentCategory === 'all'
        ? 'All'
        : currentCategory

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="text-muted-foreground animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <p className="text-red-500">
          Error loading products. Please try again later.
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <p className="text-muted-foreground">
          No products found for {category} category.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="gap-3 overflow-hidden px-0 pt-0">
          <CardContent className="px-0">
            <div className="mb-3 aspect-video w-full overflow-hidden rounded-t-md bg-gray-200">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                  width={300}
                  height={200}
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    No image
                  </span>
                </div>
              )}
            </div>

            <div className="px-4">
              <CardTitle className="text-xl">{product.title}</CardTitle>
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {product.description}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pt-0">
            <Button
              onClick={() =>
                addProduct({
                  id: generateId(),
                  title: product.title,
                  image: product.image,
                  description: product.description,
                  variants: [],
                })
              }
              disabled={isPending}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
