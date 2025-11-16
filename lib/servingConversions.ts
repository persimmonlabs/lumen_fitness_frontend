/**
 * Serving size conversion utilities
 * Converts various units to grams for nutrition calculation
 */

export const servingConversions: Record<string, number> = {
  'g': 1,
  'oz': 28.35,
  'cup': 240,
  'piece': 100, // default estimate
  'serving': 100, // default estimate
  'tbsp': 15,
  'tsp': 5,
  'lb': 453.59,
  'ml': 1, // approximate for water-like liquids
}

/**
 * Convert quantity and unit to grams
 * @param quantity - Amount of the food
 * @param unit - Unit of measurement
 * @returns Weight in grams
 */
export function convertToGrams(quantity: number, unit: string): number {
  return quantity * (servingConversions[unit] || 1)
}

/**
 * Calculate nutrition values based on grams and per-100g values
 * @param grams - Total grams of food
 * @param per100g - Nutrition values per 100g
 * @returns Calculated nutrition values
 */
export function calculateNutrition(
  grams: number,
  per100g: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
) {
  const multiplier = grams / 100

  return {
    calories: Math.round(per100g.calories * multiplier),
    protein_g: Math.round(per100g.protein * multiplier * 10) / 10,
    carbs_g: Math.round(per100g.carbs * multiplier * 10) / 10,
    fat_g: Math.round(per100g.fat * multiplier * 10) / 10,
  }
}

/**
 * Get available serving units
 */
export const servingUnits = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'cup', label: 'Cup' },
  { value: 'tbsp', label: 'Tablespoon' },
  { value: 'tsp', label: 'Teaspoon' },
  { value: 'piece', label: 'Piece' },
  { value: 'serving', label: 'Serving' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'ml', label: 'Milliliter (ml)' },
] as const
