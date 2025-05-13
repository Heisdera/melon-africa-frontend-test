'use client'

import { ProductsList } from '@/components/ProductList'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { CategoryFilter } from '@/components/CategoryFilter'

export default function Page() {
  return (
    <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
      <div>
        <CategoryFilter />

        <ProductsList />
      </div>
    </Suspense>
  )
}
