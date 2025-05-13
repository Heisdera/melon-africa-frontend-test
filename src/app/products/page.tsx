'use client'

import { ProductsList } from '@/components/ProductList'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
      <ProductsList />
    </Suspense>
  )
}
