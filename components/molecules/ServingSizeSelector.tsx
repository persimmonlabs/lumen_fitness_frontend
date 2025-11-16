/**
 * ServingSizeSelector Component
 * Allows users to select quantity and unit for food items
 */

'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/atoms/Input'
import { servingUnits } from '@/lib/servingConversions'

interface ServingSizeSelectorProps {
  initialQuantity?: number
  initialUnit?: string
  onChange: (quantity: number, unit: string) => void
  disabled?: boolean
}

export default function ServingSizeSelector({
  initialQuantity = 100,
  initialUnit = 'g',
  onChange,
  disabled = false,
}: ServingSizeSelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [unit, setUnit] = useState(initialUnit)

  useEffect(() => {
    onChange(quantity, unit)
  }, [quantity, unit, onChange])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="0.1"
          step="0.1"
          disabled={disabled}
          placeholder="Quantity"
        />
      </div>

      <div className="flex-1">
        <select
          value={unit}
          onChange={handleUnitChange}
          disabled={disabled}
          className="h-12 w-full rounded-lg border border-ocean-700 bg-ocean-800 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ocean-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {servingUnits.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
