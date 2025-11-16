import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserGoals: builder.mutation<User, {
      goal_type?: string
      calories_target?: number
      protein_target?: number
      starting_weight?: number
    }>({
      query: (data) => ({
        url: '/users/me/goals',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdateUserGoalsMutation,
} = userApi
