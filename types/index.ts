export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  eaten_at: string
  meal_type: MealType
  photo_url?: string
  is_draft: boolean
  draft_status?: 'analyzing' | 'ready' | 'error'
  items: MealItem[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
}

export interface MealItem {
  id: string
  description: string
  quantity: number
  unit: string
  grams: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  ai_confidence?: number
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface DailyAnalytics {
  date: string
  calories_consumed: number
  calories_target: number
  calories_remaining: number
  protein_consumed: number
  protein_target: number
  carbs_consumed: number
  fat_consumed: number
  meals_count: number
}

export interface WeeklyAnalytics {
  start_date: string
  end_date: string
  daily_data: Array<{
    date: string
    deficit: number
    on_track: boolean
  }>
  average_deficit: number
  target_deficit: number
}

export interface WeightEntry {
  id: string
  user_id: string
  weight_kg: number
  measured_at: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface WeightStats {
  current_weight: number
  weight_7day_avg: number
  weight_30day_avg: number
  total_change: number
  entries_count: number
  first_entry_date: string
  last_entry_date: string
}
