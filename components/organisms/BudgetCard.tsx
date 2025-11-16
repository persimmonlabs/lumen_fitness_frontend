import { NumberDisplay } from "@/components/atoms/NumberDisplay"
import { ProgressBar } from "@/components/molecules/ProgressBar"
import { Card } from "@/components/atoms/Card"
import { DailyAnalytics } from "@/types"

interface BudgetCardProps {
  analytics: DailyAnalytics
}

export function BudgetCard({ analytics }: BudgetCardProps) {
  return (
    <Card variant="elevated" className="card-hover">
      <NumberDisplay
        value={analytics.calories_remaining}
        label="calories remaining"
        size="xl"
        className="mb-6"
      />

      <p className="text-caption text-center mb-6">
        out of {analytics.calories_target.toLocaleString()}
      </p>

      <ProgressBar
        label="Protein"
        current={analytics.protein_consumed}
        target={analytics.protein_target}
        color="blue"
      />
    </Card>
  )
}
