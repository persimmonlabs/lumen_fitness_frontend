/**
 * Nutrition type definitions matching backend API contracts
 *
 * CRITICAL: Field names MUST match backend JSON tags character-for-character.
 * DO NOT modify these without corresponding backend changes.
 *
 * Generated from: backend/internal/domain/nutrition/meals/models.go
 * Last synced: 2025-11-16
 *
 * NAMING DECISIONS:
 * - consumed_at: Backend uses this (NOT eaten_at, NOT meal_time)
 * - name: For MealItem food name (NOT description, NOT food_name)
 * - quantity: Amount with unit (NOT grams - that's a separate concept)
 * - _g suffix: Used in JSON for macros (protein_g, carbs_g, fat_g, fiber_g)
 *   even though database columns don't have suffix (protein, carbs, fat, fiber)
 * - total_* fields: Calculated by database triggers, never computed client-side
 *
 * SINGLE SOURCE OF TRUTH:
 * Database triggers automatically calculate and update meal totals.
 * Frontend MUST display backend-provided values only.
 */

export interface Meal {
  id: string
  user_id: string

  /** Meal category (breakfast/lunch/dinner/snack) */
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'

  /** When the meal was consumed (ISO 8601 timestamp) */
  consumed_at: string  // NOT eaten_at, NOT meal_time

  /** Aggregated nutrition totals (auto-calculated by database triggers) */
  total_calories: number   // kcal
  total_protein_g: number  // grams (note the _g suffix)
  total_carbs_g: number    // grams
  total_fat_g: number      // grams
  total_fiber_g?: number   // grams (optional)

  /** Metadata */
  is_draft: boolean
  draft_status?: 'analyzing' | 'ready' | 'error'
  photos?: string[]
  notes?: string

  created_at: string
  updated_at: string
}

export interface MealItem {
  id: string
  meal_id: string

  /** Food name (NOT description, NOT food_name) */
  name: string

  /** Amount (NOT grams) - interpret using 'unit' */
  quantity: number

  /** Unit of measurement (g, oz, serving, cup, etc.) */
  unit: string

  /** Nutrition per serving */
  calories: number     // kcal
  protein_g: number    // grams (JSON has _g even though DB column is 'protein')
  carbs_g: number      // grams (JSON has _g even though DB column is 'carbs')
  fat_g: number        // grams (JSON has _g even though DB column is 'fat')
  fiber_g?: number     // grams (JSON has _g even though DB column is 'fiber')

  created_at: string
}

/**
 * Nutrition totals calculation result
 * Used internally for displaying aggregated nutrition in UI components
 */
export interface NutritionTotals {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number
}

/**
 * Macro calculation constants (must match backend)
 * These are used for validation, not calculation.
 * The backend is the single source of truth for all calculations.
 */
export const MACRO_CONSTANTS = {
  CALORIES_PER_GRAM_PROTEIN: 4,
  CALORIES_PER_GRAM_CARBS: 4,
  CALORIES_PER_GRAM_FAT: 9,
  CALORIES_PER_GRAM_ALCOHOL: 7, // Future use
  TOLERANCE_PERCENT: 0.10,
} as const

/**
 * Type guard to check if a meal has items loaded
 * Meals from the API may or may not include items array
 */
export function mealHasItems(meal: Meal & { items?: MealItem[] }): meal is Meal & { items: MealItem[] } {
  return Array.isArray(meal.items)
}

/**
 * Calculate totals from meal items (for UI validation only)
 * WARNING: This is NOT authoritative. Always trust backend totals.
 */
export function calculateNutritionTotals(items: MealItem[]): NutritionTotals {
  return items.reduce(
    (totals, item) => ({
      calories: totals.calories + item.calories,
      protein_g: totals.protein_g + item.protein_g,
      carbs_g: totals.carbs_g + item.carbs_g,
      fat_g: totals.fat_g + item.fat_g,
      fiber_g: (totals.fiber_g ?? 0) + (item.fiber_g ?? 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 }
  )
}
