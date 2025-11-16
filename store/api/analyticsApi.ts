import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DailyAnalytics, WeeklyAnalytics } from '@/types'
import { supabase } from '@/lib/supabase'

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
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
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getDailyAnalytics: builder.query<DailyAnalytics, { date?: string }>({
      query: ({ date }) => ({
        url: '/analytics/daily',
        params: date ? { date } : {},
      }),
      providesTags: ['Analytics'],
    }),
    getWeeklyAnalytics: builder.query<WeeklyAnalytics, { start_date?: string }>({
      query: ({ start_date }) => ({
        url: '/analytics/weekly',
        params: start_date ? { start_date } : {},
      }),
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetDailyAnalyticsQuery,
  useGetWeeklyAnalyticsQuery,
} = analyticsApi
