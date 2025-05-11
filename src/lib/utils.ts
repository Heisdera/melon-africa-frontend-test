import { clsx, type ClassValue } from 'clsx'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useScroll() {
  const [isScrolling, setIsScrolling] = useState(false)

  function navScroll() {
    if (window.scrollY > 20) {
      setIsScrolling(true)
    } else {
      setIsScrolling(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', navScroll)

    return () => {
      window.removeEventListener('scroll', navScroll)
    }
  }, [])

  return { isScrolling }
}
