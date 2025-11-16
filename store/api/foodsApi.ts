/**
 * Foods API - RTK Query service for common foods and custom foods
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CommonFood, CustomFood } from '@/types/foods'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const foodsApi = createApi({
  reducerPath: 'foodsApi',
  baseQuery,
  tagTypes: ['CustomFoods'],
  endpoints: (builder) => ({
    searchCommonFoods: builder.query<CommonFood[], string>({
      query: (q: string) => `/common-foods/search?q=${encodeURIComponent(q)}`,
    }),

    getCommonFoodById: builder.query<CommonFood, string>({
      query: (id: string) => `/common-foods/${id}`,
    }),

    getUserCustomFoods: builder.query<CustomFood[], void>({
      query: () => '/custom-foods',
      providesTags: ['CustomFoods'],
    }),

    createCustomFood: builder.mutation<CustomFood, Omit<CustomFood, 'id' | 'user_id' | 'created_at'>>({
      query: (body) => ({
        url: '/custom-foods',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomFoods'],
    }),

    deleteCustomFood: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/custom-foods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomFoods'],
    }),
  }),
})

export const {
  useSearchCommonFoodsQuery,
  useGetCommonFoodByIdQuery,
  useGetUserCustomFoodsQuery,
  useCreateCustomFoodMutation,
  useDeleteCustomFoodMutation,
} = foodsApi
