import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ocean-300 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border border-ocean-700 bg-ocean-800 px-4 py-3 text-base",
            "placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-ocean-400">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = "Input"
