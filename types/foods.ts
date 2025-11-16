/**
 * Type definitions for manual meal entry system
 *
 * NOTE: These types are for client-side forms and UI.
 * For backend API contracts, see nutrition.ts which defines
 * authoritative types matching backend JSON tags exactly.
 *
 * Key differences:
 * - ManualMealItem uses 'food_name' (UI) vs MealItem uses 'name' (API)
 * - ManualMealItem has 'grams' helper field not sent to backend
 * - meal_time (UI) vs consumed_at (API)
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

/**
 * Manual meal item for client-side form data
 * IMPORTANT: When submitting to backend, map to MealItem interface from nutrition.ts
 * - food_name -> name
 * - Remove grams field (use quantity + unit instead)
 */
export interface ManualMealItem {
  id: string // temporary client-side ID
  food_name: string // Client-side only - map to 'name' for backend
  quantity: number
  unit: string
  grams: number // Client-side helper - NOT sent to backend
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
