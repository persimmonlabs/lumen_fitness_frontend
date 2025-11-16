import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'
import { mealsApi } from './api/mealsApi'
import { analyticsApi } from './api/analyticsApi'
import { userApi } from './api/userApi'
import { weightApi } from './api/weightApi'
import { foodsApi } from './api/foodsApi'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [mealsApi.reducerPath]: mealsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [weightApi.reducerPath]: weightApi.reducer,
    [foodsApi.reducerPath]: foodsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      mealsApi.middleware,
      analyticsApi.middleware,
      userApi.middleware,
      weightApi.middleware,
      foodsApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
