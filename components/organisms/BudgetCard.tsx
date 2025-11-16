import { NumberDisplay } from "@/components/atoms/NumberDisplay"
import { ProgressBar } from "@/components/molecules/ProgressBar"
import { DailyAnalytics } from "@/types"

interface BudgetCardProps {
  analytics: DailyAnalytics
}

export function BudgetCard({ analytics }: BudgetCardProps) {
  return (
    <div className="bg-ocean-800 rounded-2xl p-6 mb-6">
      <NumberDisplay
        value={analytics.calories_remaining}
        label="calories remaining"
        size="xl"
        className="mb-6"
      />

      <p className="text-sm text-ocean-400 text-center mb-6">
        out of {analytics.calories_target.toLocaleString()}
      </p>

      <ProgressBar
        label="Protein"
        current={analytics.protein_consumed}
        target={analytics.protein_target}
        color="blue"
      />
    </div>
  )
}
