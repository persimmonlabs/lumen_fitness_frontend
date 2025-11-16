'use client'

import { WeeklyChart } from "@/components/organisms/WeeklyChart"
import { useGetWeeklyAnalyticsQuery } from "@/store/api/analyticsApi"
import { InsightsSkeleton } from "@/components/molecules/LoadingSkeleton"
import { ErrorState } from "@/components/molecules/ErrorState"

export default function InsightsPage() {
  // Fetch real data from API
  const { data: weeklyData, isLoading, error } = useGetWeeklyAnalyticsQuery({})

  if (isLoading) {
    return <InsightsSkeleton />
  }

  if (error || !weeklyData) {
    return (
      <div className="p-6 pb-24">
        <h2 className="text-2xl font-bold mb-6">Insights</h2>
        <ErrorState message="Failed to load weekly analytics" />
      </div>
    )
  }

  const onTrackDays = weeklyData.daily_data.filter(d => d.on_track).length
  const totalDays = weeklyData.daily_data.length
  const weeklyDeficit = weeklyData.daily_data.reduce((sum, d) => sum + d.deficit, 0)
  const estimatedWeightLoss = Math.abs(weeklyDeficit) / 7700 // 7700 calories ≈ 1 kg

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold mb-6">Insights</h2>

      <WeeklyChart data={weeklyData} />

      <div className="mt-6 bg-ocean-800 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Progress Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ocean-400">Days on track</span>
            <span className="font-mono font-semibold">{onTrackDays} / {totalDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Weekly deficit</span>
            <span className="font-mono font-semibold">
              {weeklyDeficit.toLocaleString()} cal
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Est. weight loss</span>
            <span className="font-mono font-semibold">
              {estimatedWeightLoss.toFixed(1)} kg
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-ocean-800/50 rounded-lg p-6 border border-ocean-700">
        <h3 className="font-semibold mb-2">Keep it up!</h3>
        <p className="text-sm text-ocean-400">
          You're making great progress. Stay consistent with your calorie deficit to reach your goals.
        </p>
      </div>
    </div>
  )
}
