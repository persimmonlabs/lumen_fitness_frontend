import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        {
          // Variants
          'bg-ocean-800': variant === 'default',
          'bg-ocean-800 shadow-lg': variant === 'elevated',
          'bg-ocean-900 border border-ocean-700': variant === 'outlined',
          // Padding
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
