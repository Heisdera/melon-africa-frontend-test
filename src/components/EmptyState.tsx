import { PackageOpen } from 'lucide-react'
import { AddProductModal } from './AddProductModal'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-muted/30 flex h-64 flex-col items-center justify-center rounded-lg border p-8 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        <AddProductModal>
          <PackageOpen className="text-muted-foreground h-10 w-10" />
        </AddProductModal>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {description}
      </p>
    </div>
  )
}
