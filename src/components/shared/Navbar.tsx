'use client'

import { cn, useScroll } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Logo } from './Logo'

const Navbar = () => {
  const pathname = usePathname()
  const { isScrolling } = useScroll()

  return (
    <nav
      aria-label="Navigation bar"
      className={cn('sticky top-0 right-0 left-0 z-40 border-b bg-white', {
        'border-none shadow-md backdrop-blur-lg': isScrolling,
      })}
    >
      <div className="mx-auto flex h-[70px] w-full items-center justify-between px-4 lg:px-8">
        <Logo />

        <Button asChild>
          {pathname === '/' ? (
            <Link href={'/products'}>All Products</Link>
          ) : (
            <Link href={'/'}>View My Products</Link>
          )}
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
