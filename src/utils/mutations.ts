'use client'

import { PRODUCTS_KEY } from '@/constants'
import {
  addProduct,
  addVariant,
  deleteProduct,
  deleteVariant,
  updateProduct,
  updateVariant,
} from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Product mutations
export function useAddProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Product added', {
        description: 'Your product has been added successfully.',
      })
    },
  })
}

export function useEditProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Product updated', {
        description: 'Your product has been updated successfully.',
      })
    },
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Product deleted', {
        description: 'Your product has been deleted successfully.',
      })
    },
  })
}

// Variant mutations
export function useAddVariantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Variant added', {
        description: 'Your variant has been added successfully.',
      })
    },
  })
}

export function useEditVariantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Variant updated', {
        description: 'Your variant has been updated successfully.',
      })
    },
  })
}

export function useDeleteVariantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })

      toast.success('Variant deleted', {
        description: 'Your variant has been deleted successfully.',
      })
    },
  })
}
