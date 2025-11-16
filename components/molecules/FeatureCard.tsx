'use client'

import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg bg-ocean-800 border border-ocean-700",
        "text-center space-y-3",
        className
      )}
    >
      <div className="text-4xl">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="text-ocean-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
