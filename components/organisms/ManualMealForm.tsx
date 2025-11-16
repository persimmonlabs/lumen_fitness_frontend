/**
 * ManualMealForm Component
 * Full-page form for manual meal entry without AI parsing
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { PlusIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import FoodSearchInput from '@/components/molecules/FoodSearchInput'
import ServingSizeSelector from '@/components/molecules/ServingSizeSelector'
import MealItemRow from '@/components/molecules/MealItemRow'
import CustomFoodForm from '@/components/molecules/CustomFoodForm'
import { CommonFood, ManualMealItem, MealTotals } from '@/types/foods'
import { convertToGrams, calculateNutrition } from '@/lib/servingConversions'
import { useCreateMealMutation } from '@/store/api/mealsApi'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
] as const

export default function ManualMealForm() {
  const router = useRouter()
  const [createMeal, { isLoading: isSaving }] = useCreateMealMutation()

  // Form state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0])
  const [mealTime, setMealTime] = useState(new Date().toTimeString().slice(0, 5))
  const [items, setItems] = useState<ManualMealItem[]>([])

  // UI state
  const [selectedFood, setSelectedFood] = useState<CommonFood | null>(null)
  const [servingQuantity, setServingQuantity] = useState(100)
  const [servingUnit, setServingUnit] = useState('g')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ManualMealItem | null>(null)

  // NOTE: We display local totals for UI preview only.
  // The backend will recalculate and store the authoritative totals via database triggers.
  // This is purely for user feedback before submission.
  const totals: MealTotals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein_g: acc.protein_g + item.protein_g,
      carbs_g: acc.carbs_g + item.carbs_g,
      fat_g: acc.fat_g + item.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )

  const handleFoodSelect = (food: CommonFood) => {
    setSelectedFood(food)
  }

  const handleServingChange = (quantity: number, unit: string) => {
    setServingQuantity(quantity)
    setServingUnit(unit)
  }

  const handleAddItem = () => {
    if (!selectedFood) return

    const grams = convertToGrams(servingQuantity, servingUnit)
    const nutrition = calculateNutrition(grams, {
      calories: selectedFood.calories_per_100g,
      protein: selectedFood.protein_per_100g,
      carbs: selectedFood.carbs_per_100g,
      fat: selectedFood.fat_per_100g,
    })

    const newItem: ManualMealItem = {
      id: uuidv4(),
      food_name: selectedFood.name,
      quantity: servingQuantity,
      unit: servingUnit,
      grams: Math.round(grams * 10) / 10,
      ...nutrition,
    }

    setItems((prev) => [...prev, newItem])
    setSelectedFood(null)
    setServingQuantity(100)
    setServingUnit('g')
  }

  const handleCustomFoodSuccess = (customFood: {
    name: string
    quantity: number
    unit: string
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }) => {
    const grams = convertToGrams(customFood.quantity, customFood.unit)

    const newItem: ManualMealItem = {
      id: uuidv4(),
      food_name: customFood.name,
      quantity: customFood.quantity,
      unit: customFood.unit,
      grams: Math.round(grams * 10) / 10,
      calories: customFood.calories,
      protein_g: customFood.protein_g,
      carbs_g: customFood.carbs_g,
      fat_g: customFood.fat_g,
      is_custom: true,
    }

    setItems((prev) => [...prev, newItem])
  }

  const handleEditItem = (item: ManualMealItem) => {
    setEditingItem(item)
    // In a full implementation, you'd show an edit modal here
    // For now, we'll just allow deletion
  }

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSaveMeal = async () => {
    if (items.length === 0) {
      alert('Please add at least one food item')
      return
    }

    try {
      // NOTE: We do NOT send total_* fields to the backend.
      // Database triggers will calculate accurate totals from meal items.
      // Backend is the single source of truth for nutrition calculations.
      await createMeal({
        meal_type: mealType,
        meal_date: mealDate,
        meal_time: mealTime,
        items: items.map((item) => ({
          food_name: item.food_name,
          quantity: item.quantity,
          unit: item.unit,
          calories: item.calories,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g,
        })),
        manual: true,
        // total_calories, total_protein_g, etc. REMOVED - backend calculates via triggers
      }).unwrap()

      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to save meal:', error)
      alert('Failed to save meal. Please try again.')
    }
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-ocean-400 hover:text-white hover:bg-ocean-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Manual Meal Entry</h1>
      </header>

      <div className="px-6 space-y-6">
        {/* Meal Details Section */}
        <div className="bg-ocean-800 rounded-lg border border-ocean-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Meal Details</h2>

          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium text-ocean-300 mb-2">
              Meal Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMealType(type.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    mealType === type.value
                      ? 'border-ocean-500 bg-ocean-700 text-white'
                      : 'border-ocean-700 hover:border-ocean-600 text-ocean-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-300 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <Input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Add Items Section */}
        <div className="bg-ocean-800 rounded-lg border border-ocean-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Food Items</h2>

          {/* Food Search */}
          <div>
            <label className="block text-sm font-medium text-ocean-300 mb-2">
              Search Foods
            </label>
            <FoodSearchInput onSelect={handleFoodSelect} />
          </div>

          {/* Selected Food + Serving Size */}
          {selectedFood && (
            <div className="p-4 bg-ocean-700 border border-ocean-600 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{selectedFood.name}</h3>
                  <p className="text-sm text-ocean-400">{selectedFood.category}</p>
                </div>
                <div className="text-sm text-ocean-300">
                  {selectedFood.calories_per_100g} cal/100g
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-300 mb-2">
                  Serving Size
                </label>
                <ServingSizeSelector
                  initialQuantity={servingQuantity}
                  initialUnit={servingUnit}
                  onChange={handleServingChange}
                />
              </div>

              <Button
                onClick={handleAddItem}
                className="w-full justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add to Meal
              </Button>
            </div>
          )}

          {/* Custom Food Button */}
          <Button
            variant="secondary"
            onClick={() => setShowCustomForm(true)}
            className="w-full justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Custom Food
          </Button>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="bg-ocean-800 rounded-lg border border-ocean-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Meal Items ({items.length})
            </h2>

            <div className="space-y-2">
              {items.map((item) => (
                <MealItemRow
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Totals Display */}
        {items.length > 0 && (
          <div className="bg-ocean-800 rounded-lg border border-ocean-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Total Nutrition</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-ocean-400">{totals.calories}</div>
                <div className="text-sm text-ocean-300">Calories</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-ocean-400">{totals.protein_g.toFixed(1)}g</div>
                <div className="text-sm text-ocean-300">Protein</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-ocean-400">{totals.carbs_g.toFixed(1)}g</div>
                <div className="text-sm text-ocean-300">Carbs</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-ocean-400">{totals.fat_g.toFixed(1)}g</div>
                <div className="text-sm text-ocean-300">Fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {items.length > 0 && (
          <Button
            onClick={handleSaveMeal}
            disabled={isSaving}
            size="lg"
            className="w-full justify-center gap-2"
          >
            {isSaving ? 'Saving Meal...' : 'Save Meal'}
          </Button>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12 text-ocean-400">
            <p className="text-lg">Start by searching for foods or adding custom items</p>
            <p className="text-sm mt-2 text-ocean-500">Your meal items will appear here</p>
          </div>
        )}
      </div>

      {/* Custom Food Modal */}
      <CustomFoodForm
        isOpen={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        onSuccess={handleCustomFoodSuccess}
      />
    </div>
  )
}
