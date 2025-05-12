import { get_products, get_products_category_list } from '@/actions/api'
import { useQuery } from '@tanstack/react-query'

// Pproducts
export function useProducts(category: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: [`${category}-products`],
    queryFn: () => get_products(category),
    retry: 2,
  })

  return {
    isLoading,
    error,
    data,
  }
}

// Category List
export function useCategories() {
  const { isLoading, data, error } = useQuery({
    queryKey: [`category-list`],
    queryFn: get_products_category_list,
    retry: 2,
  })

  return {
    isLoading,
    error,
    data,
  }
}
