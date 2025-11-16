'use client'

import { useState } from "react"
import { Meal, MealItem } from "@/types"
import { Button } from "@/components/atoms/Button"
import { QuantityControl } from "@/components/molecules/QuantityControl"
import { MacroBreakdown } from "@/components/molecules/MacroBreakdown"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface MealConfirmProps {
  draft: Meal
  onConfirm: (items: MealItem[]) => void
  onCancel: () => void
}

export function MealConfirm({ draft, onConfirm, onCancel }: MealConfirmProps) {
  const [items, setItems] = useState<MealItem[]>(draft.items)

  // NOTE: This is a UI-only preview calculation for immediate user feedback.
  // When items are confirmed, the backend will recalculate all nutrition values
  // via database triggers. These client-side calculations are NOT authoritative.
  const updateItemQuantity = (index: number, newGrams: number) => {
    const ratio = newGrams / items[index].grams
    const updated = [...items]
    updated[index] = {
      ...updated[index],
      grams: newGrams,
      // Proportional scaling for preview only - backend will recalculate accurately
      calories: Math.round(updated[index].calories * ratio),
      protein_g: updated[index].protein_g * ratio,
      carbs_g: updated[index].carbs_g * ratio,
      fat_g: updated[index].fat_g * ratio,
    }
    setItems(updated)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // NOTE: This is a temporary UI preview calculation that updates as users edit items.
  // When the meal is confirmed, the backend will recalculate and store authoritative
  // totals via database triggers. These client-side totals are NOT persisted.
  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein_g,
      carbs: acc.carbs + item.carbs_g,
      fat: acc.fat + item.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="fixed inset-0 bg-ocean-950 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Confirm Meal</h2>
          <button onClick={onCancel} className="p-2">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-ocean-800 rounded-lg p-4 mb-6">
          <div className="text-center mb-2">
            <span className="text-3xl font-mono font-bold">{totals.calories}</span>
            <span className="text-ocean-400 ml-2">calories</span>
          </div>
          <MacroBreakdown
            protein={totals.protein}
            carbs={totals.carbs}
            fat={totals.fat}
            className="justify-center"
          />
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="bg-ocean-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium">{item.description}</h3>
                  <p className="text-sm text-ocean-400">
                    {item.calories} cal · {Math.round(item.protein_g)}g protein
                  </p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <QuantityControl
                value={item.grams}
                unit="g"
                onChange={(newValue) => updateItemQuantity(index, newValue)}
                step={10}
              />
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => onConfirm(items)}
          disabled={items.length === 0}
        >
          Save Meal
        </Button>
      </div>
    </div>
  )
}
