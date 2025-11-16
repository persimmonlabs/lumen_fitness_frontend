import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6", className)}>
      {icon && (
        <div className="mb-4 text-ocean-600">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-ocean-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-ocean-400 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}
