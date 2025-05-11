export type APIResponse<T> = {
  success: boolean
  message: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
}
