'use client'

import { BottomNav } from "@/components/organisms/BottomNav"
import { ProtectedRoute } from "@/components/providers/ProtectedRoute"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
      <BottomNav />
    </ProtectedRoute>
  )
}
