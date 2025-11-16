import * as React from "react"
import { cn } from "@/lib/utils"
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  children: React.ReactNode
}

const variantConfig = {
  error: {
    icon: XCircleIcon,
    styles: 'bg-red-900/20 border-red-500 text-red-300',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    styles: 'bg-amber-900/20 border-amber-500 text-amber-300',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: InformationCircleIcon,
    styles: 'bg-ocean-800 border-ocean-500 text-ocean-300',
    iconColor: 'text-ocean-500',
  },
  success: {
    icon: CheckCircleIcon,
    styles: 'bg-green-900/20 border-green-500 text-green-300',
    iconColor: 'text-green-500',
  },
}

export function Alert({
  className,
  variant = 'info',
  title,
  children,
  ...props
}: AlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex gap-3",
        config.styles,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
