/**
 * MealItemRow Component
 * Displays a single meal item with nutrition breakdown
 */

'use client'

import { ManualMealItem } from '@/types/foods'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface MealItemRowProps {
  item: ManualMealItem
  onEdit: (item: ManualMealItem) => void
  onDelete: (id: string) => void
}

export default function MealItemRow({ item, onEdit, onDelete }: MealItemRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-ocean-800 border border-ocean-700 rounded-lg hover:bg-ocean-700 transition-colors">
      {/* Food Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">
          {item.food_name}
        </h4>
        <p className="text-sm text-ocean-400">
          {item.quantity} {item.unit} ({item.grams}g)
        </p>
      </div>

      {/* Nutrition Breakdown */}
      <div className="flex gap-4 items-center text-sm">
        <div className="text-center min-w-[60px]">
          <div className="font-semibold">{item.calories}</div>
          <div className="text-xs text-ocean-400">cal</div>
        </div>

        <div className="text-center min-w-[50px]">
          <div className="font-medium text-ocean-300">{item.protein_g}g</div>
          <div className="text-xs text-ocean-400">protein</div>
        </div>

        <div className="text-center min-w-[50px]">
          <div className="font-medium text-ocean-300">{item.carbs_g}g</div>
          <div className="text-xs text-ocean-400">carbs</div>
        </div>

        <div className="text-center min-w-[50px]">
          <div className="font-medium text-ocean-300">{item.fat_g}g</div>
          <div className="text-xs text-ocean-400">fat</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-ocean-400 hover:text-white hover:bg-ocean-600 rounded-lg transition-colors"
          aria-label="Edit item"
        >
          <PencilIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-ocean-400 hover:text-red-400 hover:bg-ocean-600 rounded-lg transition-colors"
          aria-label="Delete item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
