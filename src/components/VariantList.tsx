'use client'

import { Edit, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/ConfirmModal'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Variant } from '@/types'
import { useState } from 'react'
import { useDeleteVariantMutation } from '@/utils/mutations'

interface VariantListProps {
  variants: Variant[]
  onEdit: (variant: Variant) => void
}

export function VariantList({ variants, onEdit }: VariantListProps) {
  const [deletingVariantId, setDeletingVariantId] = useState<string | null>(
    null
  )

  const { mutate: deleteVariant } = useDeleteVariantMutation()

  const handleDeleteVariant = () => {
    if (deletingVariantId) {
      deleteVariant(deletingVariantId)
      setDeletingVariantId(null)
    }
  }

  return (
    <div className="w-full border-t">
      <div className="divide-y">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="hover:bg-muted/30 group/variant py-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-full space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{variant.name}</h4>
                    <span className="text-muted-foreground text-sm">
                      (SKU: {variant.sku})
                    </span>
                  </div>

                  <div className="flex gap-1 opacity-0 transition-opacity group-hover/variant:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(variant)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Variant</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingVariantId(variant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Variant</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {variant.size && (
                    <span>
                      Size: <span className="font-medium">{variant.size}</span>
                    </span>
                  )}
                  {variant.color && (
                    <span>
                      Color:{' '}
                      <span className="font-medium">{variant.color}</span>
                    </span>
                  )}
                  <span>
                    Price:{' '}
                    <span className="font-medium">
                      {formatCurrency(variant.price)}
                    </span>
                  </span>
                  <span>
                    Stock: <span className="font-medium">{variant.stock}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deletingVariantId}
        onOpenChange={(open) => !open && setDeletingVariantId(null)}
        title="Delete Variant"
        description="Are you sure you want to delete this variant? This action cannot be undone."
        onConfirm={handleDeleteVariant}
      />
    </div>
  )
}
