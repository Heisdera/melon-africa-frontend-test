'use client'

import { categories } from '@/data'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'

export const CategoryFilter = () => {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'products'

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
            {categories[activeCollectionIndex].text === 'All'
              ? 'All Products'
              : categories[activeCollectionIndex].text}
          </h2>
        </div>

        <p className="mr-2 space-x-1 text-sm">
          <span className="font-medium text-gray-700">194</span>
          <span className="text-gray-500">Results</span>
        </p>
      </div>
    </div>
  )
}
