'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { EmptyState } from '@/components/EmptyState'
import { ProductCard } from '@/components/ProductCard'
import { getProducts } from '@/lib/utils'
import { AddProductModal } from './AddProductModal'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PRODUCTS_KEY } from '@/constants'

export function ProductDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: products = [], isLoading } = useQuery({
    queryKey: [PRODUCTS_KEY],
    queryFn: getProducts,
  })

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mx-auto space-y-5 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Product Manager</h1>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 -z-10 h-4.5 w-4.5 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            className="h-[42px] rounded-lg pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <AddProductModal>
          <Button variant="outline" size="lg">
            <Plus className="size-6" />
          </Button>
        </AddProductModal>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {filteredProducts.map((product, i) => (
            <ProductCard key={`product_${i}_${product.id}`} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? 'No products found' : 'No products yet'}
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Add your first product to get started'
          }
        />
      )}
    </div>
  )
}
