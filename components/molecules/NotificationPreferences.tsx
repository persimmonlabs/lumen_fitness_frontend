'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UserSettings {
  user_id: string
  notifications_enabled: boolean
  email_notifications: boolean
  weekly_reports: boolean
  theme: string
  language: string
  timezone: string
  created_at: string
  updated_at: string
}

export function NotificationPreferences() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [saving, setSaving] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          console.error('No authentication token')
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const response = await fetch(`${apiUrl}/user/settings`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleToggle = async (key: keyof Pick<UserSettings, 'notifications_enabled' | 'email_notifications' | 'weekly_reports'>) => {
    if (!settings) return

    const newValue = !settings[key]
    setSettings((prev) => prev ? ({ ...prev, [key]: newValue }) : null)

    // Save to backend
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const response = await fetch(`${apiUrl}/user/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [key]: newValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      // Revert on error
      setSettings((prev) => prev ? ({ ...prev, [key]: !newValue }) : null)
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

  if (!settings) {
    return (
      <div className="space-y-1">
        <p className="text-sm text-ocean-400">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="mb-4">
        <p className="text-sm font-semibold text-ocean-300 mb-2">Notifications</p>
        <PreferenceToggle
          label="Enable all notifications"
          description="Master toggle for all notification types"
          checked={settings.notifications_enabled}
          onChange={() => handleToggle('notifications_enabled')}
        />
        <PreferenceToggle
          label="Email notifications"
          description="Receive notifications via email"
          checked={settings.email_notifications}
          onChange={() => handleToggle('email_notifications')}
          disabled={!settings.notifications_enabled}
        />
        <PreferenceToggle
          label="Weekly reports"
          description="Get a weekly progress report via email"
          checked={settings.weekly_reports}
          onChange={() => handleToggle('weekly_reports')}
          disabled={!settings.notifications_enabled || !settings.email_notifications}
        />
      </div>
    </div>
  )
}
