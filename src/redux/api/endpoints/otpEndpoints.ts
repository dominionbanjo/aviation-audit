import { apiSlice } from "../apiSlice";

export interface OtpSummary {
  totalFlights: number;
  otpPercentage: number;
  averageDelay: number;
  delayedFlights: number;
  trend: { date: string; otp: number; flights: number }[];
}

export interface AirlineOtp {
  airline: string;
  totalFlights: number;
  otp: number;
}

export interface DelayCategory {
  code: string;
  name: string;
  value: number;
}

export interface RoutePerformance {
  route: string;
  totalFlights: number;
  otp: number;
  avgDelay: number;
}

export interface OtpRecord {
  id: string;
  flightNumber: string;
  aircraftRegistration: string;
  aircraftType: string;
  airline: string;
  route: string;
  date: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  wasDelayed: boolean;
  delayMinutes: number;
  delayCode: string | null;
  delayDescription: string | null;
  responsibleDepartment: string;
  crewIssue: boolean;
  maintenanceIssue: boolean;
  groundHandlingIssue: boolean;
  boardingDelay: number;
  refuelingDelay: number;
  pushbackDelay: number;
  crewReportingDelay: number;
  maintenanceDelay: number;
  baggageHandlingDelay: number;
  wasSopFollowed: boolean;
  wasEscalationDone: boolean;
  wasDelayAvoidable: boolean;
  correctiveAction: string | null;
  auditorRemarks: string | null;
  createdAt: string;
}

interface PaginatedOtpRecordsResponse {
  data: OtpRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const otpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOtpSummary: builder.query<OtpSummary, void>({
      query: () => "/otp/summary",
      providesTags: [{ type: "Otp", id: "SUMMARY" }],
    }),

    getOtpAirlines: builder.query<AirlineOtp[], void>({
      query: () => "/otp/airlines",
      providesTags: [{ type: "Otp", id: "AIRLINES" }],
    }),

    getOtpDelayCategories: builder.query<DelayCategory[], void>({
      query: () => "/otp/delay-categories",
      providesTags: [{ type: "Otp", id: "DELAY_CATEGORIES" }],
    }),

    getOtpRoutes: builder.query<RoutePerformance[], void>({
      query: () => "/otp/routes",
      providesTags: [{ type: "Otp", id: "ROUTES" }],
    }),

    getOtpRecords: builder.query<PaginatedOtpRecordsResponse, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/otp/records",
        params: params || undefined,
      }),
      providesTags: [{ type: "Otp", id: "RECORDS" }],
    }),

    submitOtpQuestionnaire: builder.mutation<{ id: string }, any>({
      query: (data) => ({
        url: "/questionnaire/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Otp", id: "SUMMARY" },
        { type: "Otp", id: "AIRLINES" },
        { type: "Otp", id: "DELAY_CATEGORIES" },
        { type: "Otp", id: "ROUTES" },
        { type: "Otp", id: "RECORDS" },
      ],
    }),
  }),
});

export const {
  useGetOtpSummaryQuery,
  useGetOtpAirlinesQuery,
  useGetOtpDelayCategoriesQuery,
  useGetOtpRoutesQuery,
  useGetOtpRecordsQuery,
  useSubmitOtpQuestionnaireMutation,
} = otpApi;
