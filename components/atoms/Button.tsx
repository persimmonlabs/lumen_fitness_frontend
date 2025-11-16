import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ocean-400",
        "disabled:opacity-50 disabled:pointer-events-none",
        {
          'bg-ocean-500 text-white hover:bg-ocean-600': variant === 'primary',
          'bg-ocean-800 text-white hover:bg-ocean-700': variant === 'secondary',
          'bg-transparent text-ocean-300 hover:bg-ocean-800': variant === 'ghost',
          'h-9 px-3 text-sm': size === 'sm',
          'h-11 px-4 text-base': size === 'md',
          'h-14 px-6 text-lg min-h-[44px]': size === 'lg',  // Touch target
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
