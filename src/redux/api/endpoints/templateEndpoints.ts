import { apiSlice } from "../apiSlice";
import { AuditCategory, AuditQuestion } from "@/lib/db/schema";
import { TemplateWithMeta, CreateTemplatePayload } from "@/lib/services/audit-template.service";
import { PaginatedResponse } from "@/lib/api/pagination";

// ─── Response Types ────────────────────────────────────────────────────────
interface TemplateDetail {
  id: string;
  name: string;
  locationType: string;
  regulatoryBase: string;
  createdAt: string;
  updatedAt: string;
  categories: (AuditCategory & {
    questions: AuditQuestion[];
  })[];
}

interface SingleTemplateResponse {
  template: TemplateDetail;
}

interface StatsResponse {
  stats: {
    totalTemplates: number;
    totalQuestions: number;
    averageQuestionsPerTemplate: number;
  };
}

// ─── Endpoint Injection ───────────────────────────────────────────────────
export const templateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<PaginatedResponse<TemplateWithMeta>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/protected/audit/templates",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          search: params?.search ?? "",
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Templates" as const, id })),
              { type: "Templates", id: "LIST" },
            ]
          : [{ type: "Templates", id: "LIST" }],
    }),

    getTemplate: builder.query<SingleTemplateResponse, string>({
      query: (id) => `/protected/audit/templates/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Templates", id }],
    }),

    getStats: builder.query<StatsResponse, void>({
      query: () => "/protected/audit/templates/stats",
      providesTags: [{ type: "Stats", id: "GLOBAL" }],
    }),

    createTemplate: builder.mutation<{ templateId: string }, Omit<CreateTemplatePayload, "createdBy">>({
      query: (data) => ({
        url: "/protected/audit/templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Templates", id: "LIST" }, { type: "Stats", id: "GLOBAL" }],
    }),

    updateTemplate: builder.mutation<void, { id: string; data: Omit<CreateTemplatePayload, "createdBy"> }>({
      query: ({ id, data }) => ({
        url: `/protected/audit/templates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Templates", id },
        { type: "Templates", id: "LIST" },
      ],
    }),

    deleteTemplate: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/protected/audit/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Templates", id },
        { type: "Templates", id: "LIST" },
        { type: "Stats", id: "GLOBAL" },
      ],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useGetStatsQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
