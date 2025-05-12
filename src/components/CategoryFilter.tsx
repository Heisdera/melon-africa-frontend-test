'use client'

import { cn } from '@/lib/utils'
import { useCategories, useProducts } from '@/utils/queries'
import { motion } from 'framer-motion'
import { ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { dummyCategories } from '@/data'

export const CategoryFilter = () => {
  const searchParams = useSearchParams()
  const { data: categoriesResponse, isLoading, error } = useCategories()
  const currentCategory = searchParams.get('category') || 'all'
  const { data } = useProducts(currentCategory)
  console.log({ data })
  const categories = categoriesResponse?.data || dummyCategories

  const activeCollectionIndex = categories.findIndex(
    (category) => category.link === currentCategory
  )

  const categoryRefs = useRef(new Map())

  useEffect(() => {
    const activeRef = categoryRefs.current.get(currentCategory)
    if (activeRef) {
      activeRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentCategory])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-full space-y-3 py-5">
        <div className="hide-scrollbar space-x-2 overflow-x-scroll scroll-smooth px-[2px] py-1 whitespace-nowrap sm:space-x-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <Button
              key={i}
              variant="outline"
              className="pointer-events-none"
              disabled
            >
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="ml-1 flex items-center gap-1">
            <ChevronsRight className="text-gray-300" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="mr-2 h-5 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (error || !categoriesResponse) {
    return (
      <div className="mx-auto max-w-full py-5">
        Failed to load categories. Please try again
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-full space-y-3 py-5">
      <div className="hide-scrollbar space-x-2 overflow-x-scroll scroll-smooth px-[2px] py-1 whitespace-nowrap sm:space-x-3">
        {categories.map((category, i) => (
          <Button
            key={i}
            asChild
            variant="outline"
            ref={(el) => {
              if (el) {
                categoryRefs.current.set(category.link, el)
              }
            }}
          >
            <Link
              href={`/products?category=${category.link}`}
              type="button"
              className={cn('relative text-black/70', {
                'text-black': currentCategory === category.link,
              })}
            >
              {currentCategory === category.link && (
                <motion.span
                  layoutId="collection"
                  transition={{
                    type: 'spring',
                    duration: 1,
                  }}
                  className="absolute -inset-[1px] right-0 left-0 z-10 rounded-md border border-gray-800 bg-[#f9f9f9]"
                ></motion.span>
              )}

              <span className="relative z-30">{category.text}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="ml-1 flex items-center gap-1 font-medium text-gray-900">
          <ChevronsRight />
          <h2 className="text-lg xl:text-xl">
            {activeCollectionIndex >= 0 &&
            categories[activeCollectionIndex]?.text === 'All'
              ? 'All Products'
              : activeCollectionIndex >= 0
                ? categories[activeCollectionIndex]?.text
                : 'Products'}
          </h2>
        </div>

        <p className="mr-2 space-x-1 text-sm">
          <span className="font-medium text-gray-700">
            {data?.data?.total || 0}
          </span>
          <span className="text-gray-500">Results</span>
        </p>
      </div>
    </div>
  )
}
