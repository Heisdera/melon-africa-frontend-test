'use client'

import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useAddProductMutation } from '@/utils/mutations'
import { useProducts } from '@/utils/queries'

export const ProductsList = () => {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  const { data } = useProducts(currentCategory)
  const { mutate: addProduct, isPending } = useAddProductMutation()

  const products = data?.data?.products || []

  return (
    <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
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
                  id: product.id,
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
