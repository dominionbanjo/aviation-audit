import { apiSlice } from "../apiSlice";
import { AuditTemplate, AuditCategory, AuditQuestion } from "@/lib/db/schema";
import { TemplateWithMeta, CreateTemplatePayload } from "@/lib/services/audit-template.service";

// ─── Response Types ────────────────────────────────────────────────────────
interface TemplatesResponse {
  templates: TemplateWithMeta[];
}

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
    getTemplates: builder.query<TemplatesResponse, void>({
      query: () => "/audit/templates",
      providesTags: (result) =>
        result?.templates
          ? [
              ...result.templates.map(({ id }) => ({ type: "Templates" as const, id })),
              { type: "Templates", id: "LIST" },
            ]
          : [{ type: "Templates", id: "LIST" }],
    }),

    getTemplate: builder.query<SingleTemplateResponse, string>({
      query: (id) => `/audit/templates/${id}`,
      providesTags: (result, error, id) => [{ type: "Templates", id }],
    }),

    getStats: builder.query<StatsResponse, void>({
      query: () => "/audit/templates/stats",
      providesTags: [{ type: "Stats", id: "GLOBAL" }],
    }),

    createTemplate: builder.mutation<{ templateId: string }, Omit<CreateTemplatePayload, "createdBy">>({
      query: (data) => ({
        url: "/audit/templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Templates", id: "LIST" }, { type: "Stats", id: "GLOBAL" }],
    }),

    updateTemplate: builder.mutation<void, { id: string; data: Omit<CreateTemplatePayload, "createdBy"> }>({
      query: ({ id, data }) => ({
        url: `/audit/templates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Templates", id },
        { type: "Templates", id: "LIST" },
      ],
    }),

    deleteTemplate: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/audit/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
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
