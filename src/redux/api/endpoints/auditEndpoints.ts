import { apiSlice } from "../apiSlice";
import { AuditRecord } from "@/modules/audits/types";

// ─── Response Types ────────────────────────────────────────────────────────
interface AuditsResponse {
  audits: AuditRecord[];
}

interface AuditStatsResponse {
  stats: {
    totalAuditsDone: number;
    activeAudits: number;
    uniqueLocations: number;
  };
}

interface SingleAuditWithTemplate {
  audit: AuditRecord & {
    template: {
      id: string;
      name: string;
      categories: {
        id: string;
        name: string;
        orderIndex: number;
        questions: {
          id: string;
          query: string;
          manualRef: string | null;
          orderIndex: number;
        }[];
      }[];
    };
    responses: {
      id: string;
      questionId: string;
      responseValue: string | null;
      comment: string | null;
    }[];
  };
}

// ─── Endpoint Injection ───────────────────────────────────────────────────
export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAudits: builder.query<AuditsResponse, void>({
      query: () => "/audits",
      providesTags: (result) =>
        result?.audits
          ? [
              ...result.audits.map(({ id }) => ({ type: "Audits" as const, id })),
              { type: "Audits", id: "LIST" },
            ]
          : [{ type: "Audits", id: "LIST" }],
    }),

    getAuditStats: builder.query<AuditStatsResponse, void>({
      query: () => "/audits/stats",
      providesTags: [{ type: "Stats", id: "AUDITS" }],
    }),

    getAudit: builder.query<SingleAuditWithTemplate, string>({
      query: (id) => `/audits/${id}`,
      providesTags: (result, error, id) => [{ type: "Audits", id }],
    }),

    startAudit: builder.mutation<{ auditId: string }, { templateId: string; location: string }>({
      query: (data) => ({
        url: "/audits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Audits", id: "LIST" }, { type: "Stats", id: "AUDITS" }],
    }),

    saveResponse: builder.mutation<void, { id: string; questionId: string; responseValue: string | null; comment?: string }>({
      query: ({ id, ...body }) => ({
        url: `/audits/${id}/responses`,
        method: "POST",
        body,
      }),
      // We don't invalidate LIST or STATS here to keep execution UI snappy
      // but we might want to manually update the local cache if needed.
    }),

    completeAudit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/audits/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Audits", id },
        { type: "Audits", id: "LIST" },
        { type: "Stats", id: "AUDITS" },
      ],
    }),
  }),
});

export const {
  useGetAuditsQuery,
  useGetAuditStatsQuery,
  useGetAuditQuery,
  useStartAuditMutation,
  useSaveResponseMutation,
  useCompleteAuditMutation,
} = auditApi;
