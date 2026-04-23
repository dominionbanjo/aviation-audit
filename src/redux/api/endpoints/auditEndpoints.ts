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
      query: () => "/protected/audits",
      providesTags: (result) =>
        result?.audits
          ? [
              ...result.audits.map(({ id }) => ({ type: "Audits" as const, id })),
              { type: "Audits", id: "LIST" },
            ]
          : [{ type: "Audits", id: "LIST" }],
    }),

    getAuditStats: builder.query<AuditStatsResponse, void>({
      query: () => "/protected/audits/stats",
      providesTags: [{ type: "Stats", id: "AUDITS" }],
    }),

    getAudit: builder.query<SingleAuditWithTemplate, string>({
      query: (id) => `/protected/audits/${id}`,
      providesTags: (result, error, id) => [{ type: "Audits", id }],
    }),

    startAudit: builder.mutation<{ auditId: string }, { templateId: string; location: string }>({
      query: (data) => ({
        url: "/protected/audits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Audits", id: "LIST" }, { type: "Stats", id: "AUDITS" }],
    }),

    saveResponse: builder.mutation<void, { id: string; questionId: string; responseValue: string | null; comment?: string }>({
      query: ({ id, ...body }) => ({
        url: `/protected/audits/${id}/responses`,
        method: "POST",
        body,
      }),
      // We don't invalidate LIST or STATS here to keep execution UI snappy
      // but we might want to manually update the local cache if needed.
    }),

    completeAudit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/protected/audits/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Audits", id },
        { type: "Audits", id: "LIST" },
        { type: "Stats", id: "AUDITS" },
      ],
    }),

    getDashboardSummary: builder.query<{ totalAudits: number; openFindings: number; criticalFindings: number; complianceScore: string }, void>({
      query: () => "/protected/audits/dashboard/summary",
      providesTags: [{ type: "Stats", id: "DASHBOARD_SUMMARY" }],
    }),

    getDashboardRecent: builder.query<{ 
      recentAudits: { id: string; ref: string; loc: string; date: string; status: string; color: string }[];
      recentFindings: { desc: string; audit: string; sev: string; color: string }[];
    }, void>({
      query: () => "/protected/audits/dashboard/recent",
      providesTags: [{ type: "Stats", id: "DASHBOARD_RECENT" }],
    }),

    getDashboardCharts: builder.query<{
      performanceData: { month: string; sat: number; unsat: number }[];
      severityData: { name: string; value: number; color: string }[];
      totalFindings: number;
    }, void>({
      query: () => "/protected/audits/dashboard/charts",
      providesTags: [{ type: "Stats", id: "DASHBOARD_CHARTS" }],
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
  useGetDashboardSummaryQuery,
  useGetDashboardRecentQuery,
  useGetDashboardChartsQuery,
} = auditApi;
