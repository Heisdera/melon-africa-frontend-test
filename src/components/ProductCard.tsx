'use client'

import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import type { Product, Variant } from '@/types'
import { useDeleteProductMutation } from '@/utils/mutations'
import Image from 'next/image'
import { ConfirmDialog } from './ConfirmModal'
import { EditProductModal } from './EditProductModal'
import { VariantList } from './VariantList'
import { VariantModal } from './VariantModal'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)

  const { mutate: deleteProduct } = useDeleteProductMutation()

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant)
    setIsVariantDialogOpen(true)
  }

  const handleAddVariant = () => {
    setEditingVariant(null)
    setIsVariantDialogOpen(true)
  }

  const handleDeleteProduct = async () => {
    try {
      // Delete the image from Cloudinary if it exists
      if (product.imagePublicId) {
        await fetch('/api/image/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_id: product.imagePublicId }),
        })
      }

      // Then delete the product from local storage
      deleteProduct(product.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting product image:', error)
      // Still delete the product even if image deletion fails
      deleteProduct(product.id)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditProduct = () => {
    setIsEditProductDialogOpen(true)
  }

  return (
    <>
      <Card className="gap-3 overflow-hidden px-0 pt-0">
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
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
          </div>

          <div className="px-3 md:px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{product.title}</CardTitle>

              <div className="flex gap-1 transition-opacity">
                <Button variant="ghost" size="icon" onClick={handleEditProduct}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Product</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Product</span>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
              {product.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-between px-3 pt-0 md:px-4">
          {product.variants.length > 0 ? (
            <VariantList
              variants={product.variants}
              onEdit={handleEditVariant}
            />
          ) : (
            <div className="w-full border-t pt-10">
              <div className="bg-muted/30 flex flex-col items-center justify-center rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-1 text-sm">
                  No variants added yet
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleAddVariant}
                  className="gap-1 underline hover:no-underline"
                >
                  <Plus className="h-4 w-4" />
                  Add your first variant
                </Button>
              </div>
            </div>
          )}

          {product.variants.length === 1 && (
            <div className="w-full border-t">
              <div className="bg-muted/30 flex flex-col items-center justify-center rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-1 text-sm">
                  Add another variant
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleAddVariant}
                  className="gap-1 underline hover:no-underline"
                >
                  <Plus className="h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      <EditProductModal
        product={product}
        open={isEditProductDialogOpen}
        onOpenChange={setIsEditProductDialogOpen}
      />

      <VariantModal
        open={isVariantDialogOpen}
        onOpenChange={setIsVariantDialogOpen}
        variant={editingVariant}
        productId={product.id}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and will also delete all variants."
        onConfirm={handleDeleteProduct}
      />
    </>
  )
}
