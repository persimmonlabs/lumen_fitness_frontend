import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DailyAnalytics, WeeklyAnalytics } from '@/types'

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
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
