import { apiSlice } from "../apiSlice";
import { User } from "@/lib/db/schema";

interface UsersResponse {
  users: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface InviteUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserRoleRequest {
  id: string;
  name?: string;
  role?: string;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => {
        if (!params) return "/protected/admin/users";
        const { page, limit, search } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page.toString());
        if (limit) queryParams.append("limit", limit.toString());
        if (search) queryParams.append("search", search);
        return `/protected/admin/users?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    inviteUser: builder.mutation<{ user: User }, InviteUserRequest>({
      query: (data) => ({
        url: "/protected/admin/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUserRole: builder.mutation<{ user: User }, UpdateUserRoleRequest>({
      query: ({ id, ...body }) => ({
        url: `/protected/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/protected/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    restoreUser: builder.mutation<{ user: User }, string>({
      query: (id) => ({
        url: `/protected/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useInviteUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} = adminApi;
