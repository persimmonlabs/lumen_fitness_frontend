'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { supabase } from '@/lib/supabase'

interface ChangePasswordFormProps {
  onClose: () => void
}

export function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong'
    color: string
    label: string
  } => {
    if (password.length < 8) {
      return { strength: 'weak', color: 'bg-red-500', label: 'Too short' }
    }

    let score = 0
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    if (score < 2) {
      return { strength: 'weak', color: 'bg-red-500', label: 'Weak' }
    } else if (score < 4) {
      return { strength: 'medium', color: 'bg-yellow-500', label: 'Medium' }
    } else {
      return { strength: 'strong', color: 'bg-green-500', label: 'Strong' }
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password')
      }

      // Update password with Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ocean-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>

        {success ? (
          <div className="bg-green-950/50 border border-green-900 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">
              Password updated successfully! A confirmation email has been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-ocean-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{
                          width:
                            passwordStrength.strength === 'weak'
                              ? '33%'
                              : passwordStrength.strength === 'medium'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                    <span className="text-xs text-ocean-400">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-900 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
