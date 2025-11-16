import { Meal } from "@/types"
import { MealCard } from "@/components/molecules/MealCard"
import { EmptyState } from "@/components/molecules/EmptyState"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/atoms/Button"
import { useRouter } from "next/navigation"

interface MealTimelineProps {
  meals: Meal[]
  onMealClick?: (meal: Meal) => void
}

export function MealTimeline({ meals, onMealClick }: MealTimelineProps) {
  const router = useRouter()

  if (meals.length === 0) {
    return (
      <EmptyState
        icon={<PlusCircleIcon className="icon-xl" />}
        title="No meals logged yet"
        description="Start tracking your nutrition by logging your first meal"
        action={
          <Button onClick={() => router.push('/log')}>
            Log Your First Meal
          </Button>
        }
      />
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
