import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  keepUnusedDataFor: 60, // Standardize caching time to 60 seconds
  tagTypes: ["Templates", "Stats", "Profile", "Audits"],
  endpoints: () => ({}), // Endpoints will be injected from modular files
});
