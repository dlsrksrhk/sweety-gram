export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | undefined
}
