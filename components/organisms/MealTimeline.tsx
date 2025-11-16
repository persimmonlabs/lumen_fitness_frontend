import { Meal } from "@/types"
import { MealCard } from "@/components/molecules/MealCard"

interface MealTimelineProps {
  meals: Meal[]
  onMealClick?: (meal: Meal) => void
}

export function MealTimeline({ meals, onMealClick }: MealTimelineProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-ocean-400">
        <p>No meals logged yet today.</p>
        <p className="text-sm mt-2">Start by logging your first meal!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onClick={() => onMealClick?.(meal)}
        />
      ))}
    </div>
  )
}
