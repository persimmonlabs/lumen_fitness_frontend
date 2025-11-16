/**
 * Type definitions for manual meal entry system
 */

export interface CommonFood {
  id: string
  name: string
  category: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

export interface CustomFood {
  id: string
  user_id: string
  name: string
  serving_size_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at: string
}

export interface ManualMealItem {
  id: string // temporary client-side ID
  food_name: string
  quantity: number
  unit: string
  grams: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  is_custom?: boolean
}

export interface ManualMealFormData {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  meal_date: string
  meal_time: string
  items: ManualMealItem[]
}

export interface MealTotals {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}
