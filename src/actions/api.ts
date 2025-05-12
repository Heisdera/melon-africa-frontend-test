'use server'

import { ProductCategoryType } from '@/types'
import { ApiProductResponse, ProductResponse } from '@/types/api'
import { APIResponse } from '@/types/global'
import { createFetchUtil, HttpError } from '@/utils/fetchutils'

const BaseUrl = process.env.BASE_URL as string

const apiHandler = createFetchUtil({
  baseUrl: BaseUrl,
})

export const get_products = async (
  category: string
): Promise<APIResponse<ProductResponse | null>> => {
  const endpoint =
    category === 'all' ? '/products' : `/products/category/${category}`

  try {
    const res = await apiHandler<ApiProductResponse>(endpoint, {
      method: 'GET',
      cache: 'no-store',
    })

    // Transform the data to match the desired format
    const transformedData = {
      products: res.products.map((product) => ({
        id: product.id.toString(),
        title: product.title,
        image: product.images[0] || '',
        description: product.description,
      })),
      total: res.total,
      skip: res.skip,
      limit: res.limit,
    }

    return {
      data: transformedData,
      success: true,
      message: 'Products fetched successfully',
    }
  } catch (error) {
    console.log({ error })
    if (error instanceof HttpError) {
      return {
        success: error.responseBody?.success || false,
        message:
          error.responseBody?.message || `Server error: ${error.message}`,
        data: null,
      }
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null,
      }
    }
  }
}

export const get_products_category_list = async (): Promise<
  APIResponse<ProductCategoryType[]>
> => {
  try {
    const res = await apiHandler<string[]>('/products/category-list', {
      method: 'GET',
      cache: 'no-store',
    })

    const formatCategoryText = (category: string): string => {
      // Special cases for men's and women's
      if (category.startsWith('mens-')) {
        return "Men's " + formatCategoryText(category.substring(5))
      }
      if (category.startsWith('womens-')) {
        return "Women's " + formatCategoryText(category.substring(7))
      }

      return category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    const formattedCategories: ProductCategoryType[] = [
      { text: 'All', link: 'all' },
      ...res.map((category) => ({
        text: formatCategoryText(category),
        link: category,
      })),
    ]

    return {
      data: formattedCategories,
      success: true,
      message: 'Category list fetched successfully',
    }
  } catch (error) {
    console.log({ error })
    if (error instanceof HttpError) {
      return {
        success: error.responseBody?.success || false,
        message:
          error.responseBody?.message || `Server error: ${error.message}`,
        data: [],
      }
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: [],
      }
    }
  }
}
