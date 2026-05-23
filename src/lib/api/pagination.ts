export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function getPaginationParams(urlStr: string, defaultLimit = 10) {
  const url = new URL(urlStr);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.max(1, parseInt(url.searchParams.get("limit") ?? String(defaultLimit), 10));
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search") ?? "";
  return { page, limit, offset, search };
}

export function getPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedData<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
