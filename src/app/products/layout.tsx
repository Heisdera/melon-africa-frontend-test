import { CategoryFilter } from '@/components/CategoryFilter'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CategoryFilter />

      {children}
    </div>
  )
}
