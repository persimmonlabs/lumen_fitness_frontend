/**
 * Manual Meal Entry Page
 * Route: /log/manual
 */

'use client'

import ManualMealForm from '@/components/organisms/ManualMealForm'

export default function ManualMealPage() {
  return (
    <div className="min-h-screen">
      <ManualMealForm />
    </div>
  )
}
