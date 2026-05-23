import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: "/api" });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Session expired or unauthorized -> Clear local auth state
    // This will trigger the redirect in the layout.tsx guard
    api.dispatch(clearAuth());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 60, // Standardize caching time to 60 seconds
  tagTypes: ["Templates", "Stats", "Profile", "Audits", "Otp", "Findings", "Airlines", "Routes", "DelayCategories"],
  endpoints: () => ({}), // Endpoints will be injected from modular files
});
