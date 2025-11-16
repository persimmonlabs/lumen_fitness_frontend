"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { WeightEntry } from "@/types"
import { format } from "date-fns"

interface WeightEntryFormProps {
  entry?: WeightEntry
  onSubmit: (data: { weight_kg: number; measured_at: string; notes?: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function WeightEntryForm({ entry, onSubmit, onCancel, loading = false }: WeightEntryFormProps) {
  const [weight, setWeight] = useState(entry?.weight_kg.toString() || "")
  const [date, setDate] = useState(
    entry?.measured_at ? format(new Date(entry.measured_at), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  )
  const [time, setTime] = useState(
    entry?.measured_at ? format(new Date(entry.measured_at), 'HH:mm') : format(new Date(), 'HH:mm')
  )
  const [notes, setNotes] = useState(entry?.notes || "")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const weightNum = parseFloat(weight)

    // Validation
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please enter a valid weight")
      return
    }
    if (weightNum > 500) {
      setError("Weight must be less than 500 kg")
      return
    }

    // Combine date and time into ISO string
    const measured_at = new Date(`${date}T${time}`).toISOString()

    try {
      await onSubmit({
        weight_kg: weightNum,
        measured_at,
        notes: notes.trim() || undefined,
      })
    } catch (err) {
      console.error('Failed to submit weight entry:', err)
      setError('Failed to save weight entry. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-2">
          Weight (kg) *
        </label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          max="500"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="75.5"
          error={error || undefined}
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          Date *
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium mb-2">
          Time
        </label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this measurement..."
          rows={3}
          disabled={loading}
          className="flex w-full rounded-lg border border-ocean-700 bg-ocean-800 px-4 py-3 text-base placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Saving..." : entry ? "Update" : "Add Weight"}
        </Button>
      </div>
    </form>
  )
}
