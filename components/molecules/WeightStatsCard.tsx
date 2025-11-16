import { cn } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

interface WeightStatsCardProps {
  label: string
  value: number
  unit?: string
  change?: number
  changeLabel?: string
  className?: string
  loading?: boolean
}

export function WeightStatsCard({
  label,
  value,
  unit = "kg",
  change,
  changeLabel,
  className,
  loading = false,
}: WeightStatsCardProps) {
  const isPositiveChange = change !== undefined && change > 0
  const isNegativeChange = change !== undefined && change < 0
  const hasChange = change !== undefined && change !== 0

  if (loading) {
    return (
      <div className={cn("bg-ocean-800 rounded-lg p-4 border border-ocean-700", className)}>
        <div className="h-4 w-24 bg-ocean-700 rounded animate-pulse mb-3" />
        <div className="h-8 w-16 bg-ocean-700 rounded animate-pulse mb-2" />
        <div className="h-3 w-20 bg-ocean-700 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn("bg-ocean-800 rounded-lg p-4 border border-ocean-700", className)}>
      <p className="text-sm text-ocean-300 mb-2">{label}</p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold font-mono">{value.toFixed(1)}</span>
        <span className="text-ocean-400 text-sm">{unit}</span>
      </div>
      {hasChange && (
        <div className="flex items-center gap-1 mt-2">
          {isPositiveChange && (
            <ArrowUpIcon className="w-4 h-4 text-red-500" />
          )}
          {isNegativeChange && (
            <ArrowDownIcon className="w-4 h-4 text-green-500" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              isPositiveChange && "text-red-500",
              isNegativeChange && "text-green-500"
            )}
          >
            {Math.abs(change).toFixed(1)} kg
          </span>
          {changeLabel && (
            <span className="text-xs text-ocean-400 ml-1">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
