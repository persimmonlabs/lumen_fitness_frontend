export interface UserPreferences {
  email_notifications: boolean
  email_daily_summary: boolean
  email_weekly_report: boolean
  email_goal_achievements: boolean
  email_marketing: boolean
  push_notifications: boolean
  push_meal_reminders: boolean
}

export interface UserProfile {
  id: string
  email: string
  name: string
  created_at: string
  last_login?: string
  subscription_plan?: string
}

export interface UserExportData {
  user: UserProfile
  preferences: UserPreferences
  meals: any[]
  weights: any[]
  goals: any[]
  exported_at: string
}
