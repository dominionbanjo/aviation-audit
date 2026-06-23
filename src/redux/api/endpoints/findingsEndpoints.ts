import { apiSlice } from "../apiSlice";

export interface FindingRecord {
  id: string;
  auditId: string;
  auditRefNo: string;
  auditLocation: string;
  auditDate: string;
  auditorName: string | null;
  templateName: string;
  categoryName: string;
  questionQuery: string;
  questionManualRef: string | null;
  questionSeverity: string;
  comment: string | null;
  createdAt: string;
  
  rootCause: string | null;
  correctiveAction: string | null;
  responsiblePerson: string | null;
  deadline: string | null;
  findingStatus: "open" | "under-review" | "closed";
  resolvedAt: string | null;
}

export interface FindingStats {
  totalFindings: number;
  openFindings: number;
  underReviewFindings: number;
  closedFindings: number;
  criticalFindings: number;
  complianceScore: string;
}

interface PaginatedFindingsResponse {
  data: FindingRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const findingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFindings: builder.query<PaginatedFindingsResponse, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/protected/findings",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Findings" as const, id })),
              { type: "Findings", id: "LIST" },
            ]
          : [{ type: "Findings", id: "LIST" }],
    }),

    getFindingStats: builder.query<{ stats: FindingStats }, void>({
      query: () => "/protected/findings/stats",
      providesTags: [{ type: "Findings", id: "STATS" }],
    }),

    updateFinding: builder.mutation<void, { id: string; rootCause?: string; correctiveAction?: string; responsiblePerson?: string; deadline?: string | null; findingStatus?: "open" | "under-review" | "closed" }>({
      query: ({ id, ...body }) => ({
        url: `/protected/findings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Findings", id },
        { type: "Findings", id: "LIST" },
        { type: "Findings", id: "STATS" },
        // Also invalidate dashboard metrics for safety
        { type: "Stats", id: "DASHBOARD_SUMMARY" },
        { type: "Stats", id: "DASHBOARD_RECENT" },
        { type: "Stats", id: "DASHBOARD_CHARTS" },
      ],
    }),
  }),
});

export const {
  useGetFindingsQuery,
  useGetFindingStatsQuery,
  useUpdateFindingMutation,
} = findingsApi;
