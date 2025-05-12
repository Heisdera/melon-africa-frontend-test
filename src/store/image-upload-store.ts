'use client'

import { create } from 'zustand'

interface ProductForm {
  image: string | null
  fileName: string
  localImageUploadError: string | null

  setImage: (image: string | null) => void
  setFileName: (fileName: string) => void
  setLocalImageUploadError: (error: string | null) => void
  reset: () => void
}

export const useImageUploadStore = create<ProductForm>((set) => {
  return {
    image: null,
    fileName: '',
    localImageUploadError: null,

    setImage: (image) => {
      set({ image })
    },

    setFileName(fileName) {
      set({ fileName })
    },

    setLocalImageUploadError: (error) => {
      set({ localImageUploadError: error })
    },

    reset: () => {
      set({
        image: null,
        fileName: '',
        localImageUploadError: null,
      })
    },
  }
})
