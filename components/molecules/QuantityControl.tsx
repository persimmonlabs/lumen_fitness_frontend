import { Button } from "@/components/atoms/Button"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"

interface QuantityControlProps {
  value: number
  unit: string
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function QuantityControl({
  value,
  unit,
  onChange,
  min = 0,
  max = 10000,
  step = 10,
  className
}: QuantityControlProps) {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-10 h-10 p-0"
      >
        <MinusIcon className="w-4 h-4" />
      </Button>

      <div className="text-center min-w-[80px]">
        <span className="font-mono text-xl font-semibold">{value}</span>
        <span className="text-ocean-400 ml-1 text-sm">{unit}</span>
      </div>

      <Button
        size="sm"
        variant="secondary"
        onClick={handleIncrease}
        disabled={value >= max}
        className="w-10 h-10 p-0"
      >
        <PlusIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}
