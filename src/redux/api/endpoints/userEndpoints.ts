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
      query: () => "/protected/user/profile",
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/protected/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
    changePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "/protected/user/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
