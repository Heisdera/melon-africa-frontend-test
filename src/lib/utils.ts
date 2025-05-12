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

// Generate a random ID for a new product
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Convert Base64String to File
export const convertBase64StringToFile = (
  base64String: string,
  filename: string
) => {
  const [mimeType, base64Data] = base64String.split(';base64,')

  const byteCharacters = atob(base64Data)

  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  const blob = new Blob([byteArray], { type: mimeType })

  const file = new File([blob], filename, { type: mimeType })

  return file
}
