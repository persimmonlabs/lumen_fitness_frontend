'use client'

import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserAvatar } from '@/components/atoms/UserAvatar'
import { useAppSelector } from '@/store'
import { useGetDailyAnalyticsQuery } from '@/store/api/analyticsApi'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  // Get goals from daily analytics (targets)
  const today = new Date().toISOString().split('T')[0]
  const { data: analytics, isLoading: goalsLoading } = useGetDailyAnalyticsQuery({ date: today })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Get user data from auth state
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || 'No email'
  const authProvider = user?.app_metadata?.provider || 'email'
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>

      {/* User Avatar and Basic Info */}
      <Card variant="elevated">
        <div className="flex items-center gap-4 mb-4">
          <UserAvatar size="lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{userName}</h3>
            <p className="text-sm text-ocean-400">{userEmail}</p>
            <p className="text-xs text-ocean-500 mt-1">
              {authProvider === 'google' ? 'Google Account' : 'Email Account'}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ocean-400">Subscription</span>
            <span>Free Plan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Account Created</span>
            <span>{createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Auth Method</span>
            <span className="capitalize">{authProvider}</span>
          </div>
        </div>
      </Card>

      {/* User Info */}
      <Card>
        <h3 className="font-semibold mb-4">User Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ocean-400">Name</span>
            <span>{userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Email</span>
            <span>{userEmail}</span>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card>
        <h3 className="font-semibold mb-4">Goals</h3>
        {goalsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 bg-ocean-700 rounded animate-pulse" />
            ))}
          </div>
        ) : analytics ? (
          <>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ocean-400">Daily Calories</span>
                <span className="font-mono">{analytics.calories_target?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ocean-400">Daily Protein</span>
                <span className="font-mono">{analytics.protein_target}g</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Edit Goals
            </Button>
          </>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ocean-400">Daily Calories</span>
              <span className="font-mono">1,950</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ocean-400">Daily Protein</span>
              <span className="font-mono">225g</span>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Link href="/weight">
            <Button variant="secondary" size="sm" className="w-full">
              Weight Tracking
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="secondary" size="sm" className="w-full">
              Settings
            </Button>
          </Link>
        </div>
      </Card>

      {/* Sign Out */}
      <Button
        variant="ghost"
        className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  )
}
