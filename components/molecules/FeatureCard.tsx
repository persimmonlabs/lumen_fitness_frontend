'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/atoms/Card'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      variant="outlined"
      className={cn(
        "text-center space-y-4 card-hover",
        className
      )}
    >
      <div className="text-ocean-400 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="text-ocean-300 text-sm leading-relaxed">
        {description}
      </p>
    </Card>
  )
}
