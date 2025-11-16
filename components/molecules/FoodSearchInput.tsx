/**
 * FoodSearchInput Component
 * Autocomplete search for common foods database
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/atoms/Input'
import { useSearchCommonFoodsQuery } from '@/store/api/foodsApi'
import { CommonFood } from '@/types/foods'
import { useDebounce } from '@/hooks/useDebounce'

interface FoodSearchInputProps {
  onSelect: (food: CommonFood) => void
  placeholder?: string
}

export default function FoodSearchInput({
  onSelect,
  placeholder = 'Search for foods...',
}: FoodSearchInputProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 500)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: foods = [], isFetching } = useSearchCommonFoodsQuery(
    debouncedQuery,
    {
      skip: debouncedQuery.length < 2,
    }
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((food: CommonFood) => {
    onSelect(food)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }, [onSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const showDropdown = isOpen && debouncedQuery.length >= 2 && (foods.length > 0 || !isFetching)

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-400 pointer-events-none" />

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10"
        />

        {isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ocean-400" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-ocean-800 border border-ocean-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {foods.length === 0 ? (
            <div className="px-4 py-3 text-sm text-ocean-400 text-center">
              No foods found
            </div>
          ) : (
            <div className="py-1">
              {foods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelect(food)}
                  className="w-full px-4 py-3 text-left hover:bg-ocean-700 transition-colors border-b border-ocean-700 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {food.name}
                      </div>
                      <div className="text-sm text-ocean-400">
                        {food.category}
                      </div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-ocean-300 whitespace-nowrap">
                      {food.calories_per_100g} cal/100g
                    </div>
                  </div>

                  <div className="flex gap-3 mt-1 text-xs text-ocean-400">
                    <span>P: {food.protein_per_100g}g</span>
                    <span>C: {food.carbs_per_100g}g</span>
                    <span>F: {food.fat_per_100g}g</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
