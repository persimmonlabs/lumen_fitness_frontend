import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WeightEntry, WeightStats } from '@/types'
import { supabase } from '@/lib/supabase'

export const weightApi = createApi({
  reducerPath: 'weightApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    prepareHeaders: async (headers) => {
      // Get token from Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        headers.set('authorization', `Bearer ${session.access_token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Weight'],
  endpoints: (builder) => ({
    getWeightEntries: builder.query<WeightEntry[], void>({
      query: () => '/weight',
      providesTags: ['Weight'],
    }),
    getWeightStats: builder.query<WeightStats, void>({
      query: () => '/weight/stats',
      providesTags: ['Weight'],
    }),
    getWeightEntry: builder.query<WeightEntry, string>({
      query: (id) => `/weight/${id}`,
      providesTags: (result, error, id) => [{ type: 'Weight', id }],
    }),
    createWeightEntry: builder.mutation<WeightEntry, Partial<WeightEntry>>({
      query: (body) => ({
        url: '/weight',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Weight'],
    }),
    updateWeightEntry: builder.mutation<WeightEntry, { id: string; data: Partial<WeightEntry> }>({
      query: ({ id, data }) => ({
        url: `/weight/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Weight', id }, 'Weight'],
    }),
    deleteWeightEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/weight/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Weight'],
    }),
  }),
})

export const {
  useGetWeightEntriesQuery,
  useGetWeightStatsQuery,
  useGetWeightEntryQuery,
  useCreateWeightEntryMutation,
  useUpdateWeightEntryMutation,
  useDeleteWeightEntryMutation,
} = weightApi
