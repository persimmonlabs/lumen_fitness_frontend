import { Meal } from "@/types"
import { MacroPill } from "@/components/atoms/MacroPill"
import { Badge } from "@/components/atoms/Badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface MealCardProps {
  meal: Meal
  onClick?: () => void
  className?: string
}

export function MealCard({ meal, onClick, className }: MealCardProps) {
  const mealTypeIcons = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-ocean-800 rounded-lg p-4 cursor-pointer",
        "transition-all duration-200 hover:bg-ocean-700 hover:scale-[1.01]",
        "border border-ocean-700",
        meal.is_draft && "border-amber-500/50",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{mealTypeIcons[meal.meal_type]}</span>
          <div>
            <h3 className="font-medium capitalize">{meal.meal_type}</h3>
            <p className="text-sm text-ocean-300">
              {format(new Date(meal.eaten_at), 'h:mm a')}
            </p>
          </div>
        </div>
        {meal.is_draft && <Badge variant="warning">Draft</Badge>}
      </div>

      {meal.photo_url && (
        <img
          src={meal.photo_url}
          alt="Meal"
          className="w-full h-32 object-cover rounded-md mb-3"
        />
      )}

      <div className="space-y-2">
        {meal.items.slice(0, 3).map((item, i) => (
          <p key={i} className="text-sm text-ocean-200 truncate">
            {item.description} - {item.grams}g
          </p>
        ))}
        {meal.items.length > 3 && (
          <p className="text-xs text-ocean-400">+{meal.items.length - 3} more items</p>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <div className="text-sm">
          <span className="font-mono font-semibold">{meal.total_calories}</span>
          <span className="text-ocean-400 ml-1">cal</span>
        </div>
        <div className="text-sm">
          <span className="font-mono font-semibold">{Math.round(meal.total_protein)}</span>
          <span className="text-ocean-400 ml-1">g protein</span>
        </div>
      </div>
    </div>
  )
}
