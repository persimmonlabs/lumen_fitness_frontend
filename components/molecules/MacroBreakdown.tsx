import { MacroPill } from "@/components/atoms/MacroPill"

interface MacroBreakdownProps {
  protein: number
  carbs: number
  fat: number
  className?: string
}

export function MacroBreakdown({ protein, carbs, fat, className }: MacroBreakdownProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      <MacroPill label="P" value={Math.round(protein)} color="protein" />
      <MacroPill label="C" value={Math.round(carbs)} color="carbs" />
      <MacroPill label="F" value={Math.round(fat)} color="fat" />
    </div>
  )
}
