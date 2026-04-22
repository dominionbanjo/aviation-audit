import { apiSlice } from "../apiSlice";
import { User } from "@/lib/db/schema";

// ─── Response Types ────────────────────────────────────────────────────────
interface ProfileResponse {
  user: User;
}

interface UpdateProfileRequest {
  name?: string;
  role?: string;
}

// ─── Endpoint Injection ───────────────────────────────────────────────────
export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/user/profile",
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
