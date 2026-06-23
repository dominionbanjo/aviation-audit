import { apiSlice } from "../apiSlice";

export interface AirlineRecord {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface RouteRecord {
  id: string;
  origin: string;
  destination: string;
  code: string;
  createdAt: string;
}

export interface DelayCategoryRecord {
  id: string;
  code: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const entityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAirlinesList: builder.query<PaginatedResponse<AirlineRecord>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/protected/airlines",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Airlines" as const, id })),
              { type: "Airlines", id: "LIST" },
            ]
          : [{ type: "Airlines", id: "LIST" }],
    }),

    createAirline: builder.mutation<{ airline: AirlineRecord }, { name: string; code: string }>({
      query: (body) => ({
        url: "/protected/airlines",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Airlines", id: "LIST" }],
    }),

    updateAirline: builder.mutation<{ airline: AirlineRecord }, { id: string; name?: string; code?: string }>({
      query: ({ id, ...body }) => ({
        url: `/protected/airlines/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Airlines", id },
        { type: "Airlines", id: "LIST" },
      ],
    }),

    deleteAirline: builder.mutation<void, string>({
      query: (id) => ({
        url: `/protected/airlines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Airlines", id: "LIST" }],
    }),

    // Routes
    getRoutesList: builder.query<PaginatedResponse<RouteRecord>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/protected/routes",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Routes" as const, id })),
              { type: "Routes", id: "LIST" },
            ]
          : [{ type: "Routes", id: "LIST" }],
    }),

    createRoute: builder.mutation<{ route: RouteRecord }, { origin: string; destination: string; code: string }>({
      query: (body) => ({
        url: "/protected/routes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Routes", id: "LIST" }],
    }),

    updateRoute: builder.mutation<{ route: RouteRecord }, { id: string; origin?: string; destination?: string; code?: string }>({
      query: ({ id, ...body }) => ({
        url: `/protected/routes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Routes", id },
        { type: "Routes", id: "LIST" },
      ],
    }),

    deleteRoute: builder.mutation<void, string>({
      query: (id) => ({
        url: `/protected/routes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Routes", id: "LIST" }],
    }),

    // Delay Categories
    getDelayCategoriesList: builder.query<PaginatedResponse<DelayCategoryRecord>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/protected/delay-categories",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "DelayCategories" as const, id })),
              { type: "DelayCategories", id: "LIST" },
            ]
          : [{ type: "DelayCategories", id: "LIST" }],
    }),

    createDelayCategory: builder.mutation<{ category: DelayCategoryRecord }, { code: string; name: string; description?: string }>({
      query: (body) => ({
        url: "/protected/delay-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DelayCategories", id: "LIST" }],
    }),

    updateDelayCategory: builder.mutation<{ category: DelayCategoryRecord }, { id: string; code?: string; name?: string; description?: string }>({
      query: ({ id, ...body }) => ({
        url: `/protected/delay-categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DelayCategories", id },
        { type: "DelayCategories", id: "LIST" },
      ],
    }),

    deleteDelayCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/protected/delay-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DelayCategories", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAirlinesListQuery,
  useCreateAirlineMutation,
  useUpdateAirlineMutation,
  useDeleteAirlineMutation,
  
  useGetRoutesListQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  
  useGetDelayCategoriesListQuery,
  useCreateDelayCategoryMutation,
  useUpdateDelayCategoryMutation,
  useDeleteDelayCategoryMutation,
} = entityApi;
