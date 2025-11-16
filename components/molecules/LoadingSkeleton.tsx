export function BudgetCardSkeleton() {
  return (
    <div className="bg-ocean-800 rounded-2xl p-6 mb-6 animate-pulse">
      <div className="h-20 bg-ocean-700 rounded mb-4" />
      <div className="h-4 bg-ocean-700 rounded w-3/4 mb-6" />
      <div className="h-2 bg-ocean-700 rounded" />
    </div>
  )
}

export function MealTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-ocean-800 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-ocean-700 rounded w-1/4 mb-2" />
          <div className="h-3 bg-ocean-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function InsightsSkeleton() {
  return (
    <div className="p-6 pb-24">
      <div className="h-8 bg-ocean-700 rounded w-1/3 mb-6 animate-pulse" />
      <div className="bg-ocean-800 rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-48 bg-ocean-700 rounded" />
      </div>
      <div className="bg-ocean-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-ocean-700 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-ocean-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
