export type CursorPage<T> = {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export function parsePagination(searchParams: URLSearchParams) {
  return {
    cursor: searchParams.get('cursor') ?? undefined,
    limit: Math.min(parseInt(searchParams.get('limit') ?? '20'), 100),
  }
}
