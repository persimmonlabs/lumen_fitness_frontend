import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '@/types'

export const userApi = createApi({
  reducerPath: 'userApi',
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
