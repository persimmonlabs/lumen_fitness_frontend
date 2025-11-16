"use client"

import { WeightEntry } from "@/types"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface WeightHistoryProps {
  entries: WeightEntry[]
  onEdit?: (entry: WeightEntry) => void
  onDelete?: (id: string) => void
  loading?: boolean
}

export function WeightHistory({ entries, onEdit, onDelete, loading = false }: WeightHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
  )

  // Calculate change from previous entry
  const calculateChange = (index: number): number | null => {
    if (index >= sortedEntries.length - 1) return null
    const current = sortedEntries[index].weight_kg
    const previous = sortedEntries[index + 1].weight_kg
    return current - previous
  }

  const handleDelete = async (id: string) => {
    if (!onDelete) return

    if (deletingId === id) {
      // Second click confirms deletion
      await onDelete(id)
      setDeletingId(null)
    } else {
      // First click shows confirmation
      setDeletingId(id)
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700">
        <h3 className="text-lg font-semibold mb-4">Weight History</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-ocean-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700">
        <h3 className="text-lg font-semibold mb-4">Weight History</h3>
        <div className="text-center py-8 text-ocean-400">
          <p className="text-lg mb-2">No weight entries yet</p>
          <p className="text-sm">Click "Add Weight" to record your first entry</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700">
      <h3 className="text-lg font-semibold mb-4">Weight History</h3>
      <div className="space-y-2">
        {sortedEntries.map((entry, index) => {
          const change = calculateChange(index)
          const isPositive = change !== null && change > 0
          const isNegative = change !== null && change < 0

          return (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-ocean-900/50 rounded-lg border border-ocean-700 hover:bg-ocean-700/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-bold font-mono">
                    {entry.weight_kg.toFixed(1)}
                  </span>
                  <span className="text-ocean-400 text-sm">kg</span>
                  {change !== null && (
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isPositive && "text-red-500",
                        isNegative && "text-green-500"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(1)} kg
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-ocean-300">
                  <span>{format(parseISO(entry.measured_at), 'MMM dd, yyyy')}</span>
                  <span className="text-ocean-500">•</span>
                  <span>{format(parseISO(entry.measured_at), 'h:mm a')}</span>
                </div>
                {entry.notes && (
                  <p className="text-sm text-ocean-400 mt-2 italic">{entry.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entry)}
                    className="h-9 w-9 p-0"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className={cn(
                      "h-9 w-9 p-0",
                      deletingId === entry.id && "bg-red-500/20 text-red-500"
                    )}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
