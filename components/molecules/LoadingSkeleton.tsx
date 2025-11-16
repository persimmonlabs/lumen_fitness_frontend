import { Card } from "@/components/atoms/Card"

export function BudgetCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-20 bg-ocean-700 rounded mb-4" />
      <div className="h-4 bg-ocean-700 rounded w-3/4 mb-6" />
      <div className="h-2 bg-ocean-700 rounded" />
    </Card>
  )
}

export function MealTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} padding="sm" className="animate-pulse">
          <div className="h-4 bg-ocean-700 rounded w-1/4 mb-2" />
          <div className="h-3 bg-ocean-700 rounded w-3/4" />
        </Card>
      ))}
    </div>
  )
}

export function InsightsSkeleton() {
  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="h-8 bg-ocean-700 rounded w-1/3 animate-pulse" />
      <Card className="animate-pulse">
        <div className="h-48 bg-ocean-700 rounded" />
      </Card>
      <Card className="animate-pulse">
        <div className="h-6 bg-ocean-700 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-ocean-700 rounded" />
          ))}
        </div>
      </Card>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-ocean-700 rounded w-3/4" />
        <div className="h-4 bg-ocean-700 rounded w-1/2" />
        <div className="h-4 bg-ocean-700 rounded w-5/6" />
      </div>
    </Card>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 bg-ocean-800 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
