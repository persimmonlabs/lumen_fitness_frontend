'use client'

import { useState, useEffect } from 'react'

interface NotificationPreferencesState {
  email_notifications: boolean
  email_daily_summary: boolean
  email_weekly_report: boolean
  email_goal_achievements: boolean
  email_marketing: boolean
  push_notifications: boolean
  push_meal_reminders: boolean
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferencesState>({
    email_notifications: true,
    email_daily_summary: true,
    email_weekly_report: false,
    email_goal_achievements: true,
    email_marketing: false,
    push_notifications: false,
    push_meal_reminders: false,
  })
  const [saving, setSaving] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/v1/users/me/preferences')
        if (response.ok) {
          const data = await response.json()
          setPreferences(data)
        }
      } catch (err) {
        console.error('Failed to load preferences:', err)
      }
    }
    loadPreferences()
  }, [])

  const handleToggle = async (key: keyof NotificationPreferencesState) => {
    const newValue = !preferences[key]
    setPreferences((prev) => ({ ...prev, [key]: newValue }))

    // Save to backend
    setSaving(true)
    try {
      const response = await fetch('/api/v1/users/me/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...preferences,
          [key]: newValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }
    } catch (err) {
      console.error('Failed to save preferences:', err)
      // Revert on error
      setPreferences((prev) => ({ ...prev, [key]: !newValue }))
    } finally {
      setSaving(false)
    }
  }

  const PreferenceToggle = ({
    label,
    description,
    checked,
    onChange,
    disabled = false,
  }: {
    label: string
    description?: string
    checked: boolean
    onChange: () => void
    disabled?: boolean
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="text-sm">{label}</p>
        {description && (
          <p className="text-xs text-ocean-500">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        disabled={disabled || saving}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-coral-500' : 'bg-ocean-700'
        } ${disabled || saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-1">
      <div className="mb-4">
        <p className="text-sm font-semibold text-ocean-300 mb-2">Email Notifications</p>
        <PreferenceToggle
          label="Enable email notifications"
          checked={preferences.email_notifications}
          onChange={() => handleToggle('email_notifications')}
        />
        <PreferenceToggle
          label="Daily summary"
          description="Receive a daily summary of your nutrition"
          checked={preferences.email_daily_summary}
          onChange={() => handleToggle('email_daily_summary')}
          disabled={!preferences.email_notifications}
        />
        <PreferenceToggle
          label="Weekly report"
          description="Get a weekly progress report"
          checked={preferences.email_weekly_report}
          onChange={() => handleToggle('email_weekly_report')}
          disabled={!preferences.email_notifications}
        />
        <PreferenceToggle
          label="Goal achievements"
          description="Celebrate when you hit your goals"
          checked={preferences.email_goal_achievements}
          onChange={() => handleToggle('email_goal_achievements')}
          disabled={!preferences.email_notifications}
        />
        <PreferenceToggle
          label="Marketing emails"
          description="Tips, features, and updates"
          checked={preferences.email_marketing}
          onChange={() => handleToggle('email_marketing')}
          disabled={!preferences.email_notifications}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ocean-300 mb-2">Push Notifications</p>
        <PreferenceToggle
          label="Enable push notifications"
          description="Only available when installed as PWA"
          checked={preferences.push_notifications}
          onChange={() => handleToggle('push_notifications')}
        />
        <PreferenceToggle
          label="Meal reminders"
          description="Get reminders to log your meals"
          checked={preferences.push_meal_reminders}
          onChange={() => handleToggle('push_meal_reminders')}
          disabled={!preferences.push_notifications}
        />
      </div>
    </div>
  )
}
