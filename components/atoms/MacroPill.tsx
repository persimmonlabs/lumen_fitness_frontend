import { cn } from "@/lib/utils"

interface MacroPillProps {
  label: string
  value: number
  unit?: string
  color?: 'protein' | 'carbs' | 'fat'
  className?: string
}

export function MacroPill({ label, value, unit = 'g', color = 'protein', className }: MacroPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
        {
          'bg-blue-500/20 text-blue-300': color === 'protein',
          'bg-amber-500/20 text-amber-300': color === 'carbs',
          'bg-pink-500/20 text-pink-300': color === 'fat',
        },
        className
      )}
    >
      <span className="text-xs opacity-75">{label}</span>
      <span className="font-mono font-semibold">{value}{unit}</span>
    </div>
  )
}
