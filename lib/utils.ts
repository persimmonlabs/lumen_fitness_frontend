import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Reset hours for date comparison
  const resetTime = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const dateOnly = resetTime(d)
  const todayOnly = resetTime(today)
  const yesterdayOnly = resetTime(yesterday)

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today'
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday'
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(d)
  }
}

const loadingMessages = [
  "Analyzing your meal...",
  "Calculating nutrition...",
  "Processing image...",
  "Almost there...",
  "Getting nutrition data...",
]

export function getRandomLoadingMessage(): string {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
}
