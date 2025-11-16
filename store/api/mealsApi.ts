import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Meal } from '@/types'

export const mealsApi = createApi({
  reducerPath: 'mealsApi',
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
  tagTypes: ['Meal'],
  endpoints: (builder) => ({
    getMeals: builder.query<Meal[], { date?: string }>({
      query: ({ date }) => ({
        url: '/meals',
        params: date ? { date } : {},
      }),
      providesTags: ['Meal'],
    }),
    getMealById: builder.query<Meal, string>({
      query: (id) => `/meals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Meal', id }],
    }),
    createMeal: builder.mutation<Meal, FormData | any>({
      query: (data) => ({
        url: '/meals',
        method: 'POST',
        body: data,
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Meal'],
    }),
    updateMeal: builder.mutation<Meal, { id: string; data: Partial<Meal> }>({
      query: ({ id, data }) => ({
        url: `/meals/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Meal', id }, 'Meal'],
    }),
    deleteMeal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/meals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Meal'],
    }),
    parseMeal: builder.mutation<any, { photo_url?: string; description?: string; audio_file?: Blob }>({
      query: (body) => {
        const formData = new FormData()
        if (body.photo_url) {
          formData.append('photo_url', body.photo_url)
        }
        if (body.description) {
          formData.append('description', body.description)
        }
        if (body.audio_file) {
          formData.append('audio_file', body.audio_file)
        }
        return {
          url: '/meals/parse',
          method: 'POST',
          body: formData,
        }
      },
    }),
    confirmMeal: builder.mutation<Meal, { id: string; items: any[] }>({
      query: ({ id, items }) => ({
        url: `/meals/${id}/confirm`,
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: ['Meal'],
    }),
  }),
})

export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useParseMealMutation,
  useConfirmMealMutation,
} = mealsApi
