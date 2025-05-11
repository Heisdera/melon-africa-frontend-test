'use client'

import { cn, useScroll } from '@/lib/utils'
import { Logo } from './Logo'

const Navbar = () => {
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
      </div>
    </nav>
  )
}

export default Navbar
