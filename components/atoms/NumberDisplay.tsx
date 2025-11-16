import { cn } from "@/lib/utils"

interface NumberDisplayProps {
  value: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function NumberDisplay({ value, label, size = 'md', className }: NumberDisplayProps) {
  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn("font-mono font-bold", {
          'text-2xl': size === 'sm',
          'text-4xl': size === 'md',
          'text-5xl': size === 'lg',
          'text-6xl': size === 'xl',
        })}
      >
        {value.toLocaleString()}
      </div>
      {label && <div className="text-sm text-ocean-300 mt-1">{label}</div>}
    </div>
  )
}
