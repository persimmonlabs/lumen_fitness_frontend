import { cn } from "@/lib/utils"

interface ProgressBarProps {
  label: string
  current: number
  target: number
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'amber' | 'pink'
  className?: string
}

export function ProgressBar({
  label,
  current,
  target,
  showPercentage = true,
  color = 'blue',
  className
}: ProgressBarProps) {
  const percentage = Math.min(100, (current / target) * 100)
  const isOverTarget = current > target

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-ocean-300">{label}</span>
        <span className="text-sm font-mono">
          <span className={cn(isOverTarget && "text-amber-400")}>
            {Math.round(current)}
          </span>
          <span className="text-ocean-400"> / {Math.round(target)}g</span>
        </span>
      </div>

      <div className="h-2 bg-ocean-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            {
              'bg-blue-500': color === 'blue' && !isOverTarget,
              'bg-green-500': color === 'green' && !isOverTarget,
              'bg-amber-500': color === 'amber' || isOverTarget,
              'bg-pink-500': color === 'pink' && !isOverTarget,
            }
          )}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {showPercentage && (
        <div className="text-right mt-1">
          <span className="text-xs text-ocean-400">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}
