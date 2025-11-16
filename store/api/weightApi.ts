import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WeightEntry, WeightStats } from '@/types'

export const weightApi = createApi({
  reducerPath: 'weightApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
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
