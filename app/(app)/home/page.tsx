'use client'

import { BudgetCard } from "@/components/organisms/BudgetCard"
import { MealTimeline } from "@/components/organisms/MealTimeline"
import { Button } from "@/components/atoms/Button"
import { UserAvatar } from "@/components/atoms/UserAvatar"
import { formatDate } from "@/lib/utils"
import { CameraIcon, PencilIcon, MicrophoneIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store"
import { useGetDailyAnalyticsQuery } from "@/store/api/analyticsApi"
import { useGetMealsQuery } from "@/store/api/mealsApi"
import { BudgetCardSkeleton, MealTimelineSkeleton } from "@/components/molecules/LoadingSkeleton"
import { ErrorState } from "@/components/molecules/ErrorState"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  // Get user's first name for greeting
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ||
                    user?.email?.split('@')[0] ||
                    'there'

  // Determine time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Fetch real data from API
  const today = new Date().toISOString().split('T')[0]
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useGetDailyAnalyticsQuery({ date: today })
  const { data: meals, isLoading: mealsLoading, error: mealsError } = useGetMealsQuery({ date: today })

  // Handle loading and error states
  if (analyticsLoading || mealsLoading) {
    return (
      <div className="pb-20">
        <header className="p-6 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-ocean-400">{formatDate(new Date())}</p>
            <h1 className="text-2xl font-bold mt-1">{getGreeting()}, {firstName}</h1>
          </div>
          <UserAvatar size="md" className="cursor-pointer" onClick={() => router.push('/profile')} />
        </header>
        <div className="px-6">
          <BudgetCardSkeleton />
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-ocean-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
          <MealTimelineSkeleton />
        </div>
      </div>
    )
  }

  if (analyticsError || !analytics) {
    return (
      <div className="pb-20">
        <header className="p-6 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-ocean-400">{formatDate(new Date())}</p>
            <h1 className="text-2xl font-bold mt-1">{getGreeting()}, {firstName}</h1>
          </div>
          <UserAvatar size="md" className="cursor-pointer" onClick={() => router.push('/profile')} />
        </header>
        <div className="px-6">
          <ErrorState message="Failed to load analytics data" />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <header className="p-6 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-ocean-400">{formatDate(new Date())}</p>
          <h1 className="text-2xl font-bold mt-1">{getGreeting()}, {firstName}</h1>
        </div>
        <UserAvatar size="md" className="cursor-pointer" onClick={() => router.push('/profile')} />
      </header>

      <div className="px-6">
        <BudgetCard analytics={analytics} />

        <div className="grid grid-cols-3 gap-3 mb-8">
          <Button
            size="lg"
            className="flex-col gap-2 h-auto py-4"
            onClick={() => router.push('/log')}
          >
            <CameraIcon className="w-6 h-6" />
            <span className="text-xs">Photo</span>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="flex-col gap-2 h-auto py-4"
            onClick={() => router.push('/log?mode=text')}
          >
            <PencilIcon className="w-6 h-6" />
            <span className="text-xs">Text</span>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="flex-col gap-2 h-auto py-4"
            onClick={() => router.push('/log?mode=voice')}
          >
            <MicrophoneIcon className="w-6 h-6" />
            <span className="text-xs">Voice</span>
          </Button>
        </div>

        <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
        {mealsError ? (
          <ErrorState message="Failed to load meals" />
        ) : (
          <MealTimeline meals={meals || []} />
        )}
      </div>
    </div>
  )
}
