/**
 * CustomFoodForm Component
 * Modal form for adding custom foods with manual nutrition values
 */

'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useCreateCustomFoodMutation } from '@/store/api/foodsApi'
import * as Dialog from '@radix-ui/react-dialog'

interface CustomFoodFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (customFood: {
    name: string
    quantity: number
    unit: string
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }) => void
}

export default function CustomFoodForm({ isOpen, onClose, onSuccess }: CustomFoodFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    serving_size_g: 100,
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    saveAsCustom: false,
  })

  const [createCustomFood, { isLoading }] = useCreateCustomFoodMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add to meal items
    onSuccess({
      name: formData.name,
      quantity: formData.serving_size_g,
      unit: 'g',
      calories: formData.calories,
      protein_g: formData.protein_g,
      carbs_g: formData.carbs_g,
      fat_g: formData.fat_g,
    })

    // Optionally save to custom foods database
    if (formData.saveAsCustom) {
      try {
        await createCustomFood({
          name: formData.name,
          serving_size_g: formData.serving_size_g,
          calories: formData.calories,
          protein_g: formData.protein_g,
          carbs_g: formData.carbs_g,
          fat_g: formData.fat_g,
        }).unwrap()
      } catch (error) {
        console.error('Failed to save custom food:', error)
      }
    }

    // Reset and close
    setFormData({
      name: '',
      serving_size_g: 100,
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      saveAsCustom: false,
    })
    onClose()
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ocean-800 rounded-lg shadow-xl border border-ocean-700 p-6 w-full max-w-md z-50 animate-slideUp max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold">
              Add Custom Food
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-ocean-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-ocean-300 mb-2">
                Food Name *
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Homemade Protein Shake"
              />
            </div>

            {/* Serving Size */}
            <div>
              <label className="block text-sm font-medium text-ocean-300 mb-2">
                Serving Size (grams) *
              </label>
              <Input
                type="number"
                required
                min="1"
                value={formData.serving_size_g}
                onChange={(e) => handleChange('serving_size_g', parseFloat(e.target.value))}
              />
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-300 mb-2">
                  Calories *
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.calories}
                  onChange={(e) => handleChange('calories', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-300 mb-2">
                  Protein (g) *
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.protein_g}
                  onChange={(e) => handleChange('protein_g', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-300 mb-2">
                  Carbs (g) *
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.carbs_g}
                  onChange={(e) => handleChange('carbs_g', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-300 mb-2">
                  Fat (g) *
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.fat_g}
                  onChange={(e) => handleChange('fat_g', parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Save as Custom Food */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="saveAsCustom"
                checked={formData.saveAsCustom}
                onChange={(e) => handleChange('saveAsCustom', e.target.checked)}
                className="w-4 h-4 text-ocean-500 bg-ocean-700 border-ocean-600 rounded focus:ring-ocean-400"
              />
              <label htmlFor="saveAsCustom" className="text-sm text-ocean-300">
                Save to my custom foods for future use
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Adding...' : 'Add to Meal'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
