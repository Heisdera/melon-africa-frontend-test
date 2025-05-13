import Navbar from '@/components/shared/Navbar'
import { Providers } from '@/providers/Providers'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import 'styles'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Melon Africa Product Manager',
  description: 'A product manager created by Raphael Wisdom Chidera',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster
            position="top-center"
            swipeDirections={['top', 'bottom', 'right', 'left']}
          />
          <Navbar />

          <main className="px-4 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
