/**
 * Re-export nutrition types from dedicated file
 * @see nutrition.ts for authoritative type definitions matching backend
 */
export type { Meal, MealItem, NutritionTotals } from './nutrition'
export { MACRO_CONSTANTS, mealHasItems, calculateNutritionTotals } from './nutrition'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
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
