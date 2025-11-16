import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isSidebarOpen: boolean
  currentDate: string
  theme: 'dark' | 'light'
}

const initialState: UIState = {
  isSidebarOpen: false,
  currentDate: new Date().toISOString().split('T')[0],
  theme: 'dark',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
  },
})

export const { toggleSidebar, setCurrentDate, setTheme } = uiSlice.actions
export default uiSlice.reducer
