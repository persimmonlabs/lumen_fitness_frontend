'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { supabase } from '@/lib/supabase'

interface ChangeEmailFormProps {
  onClose: () => void
}

export function ChangeEmailForm({ onClose }: ChangeEmailFormProps) {
  const [currentEmail, setCurrentEmail] = useState('renato@example.com')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!newEmail || !password) {
        throw new Error('Please fill in all fields')
      }

      if (newEmail === currentEmail) {
        throw new Error('New email must be different from current email')
      }

      // Update email with Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ocean-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Change Email</h3>

        {success ? (
          <div className="bg-green-950/50 border border-green-900 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">
              Verification email sent to {newEmail}. Please check your inbox and click the
              verification link to complete the email change.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                Current Email
              </label>
              <Input
                type="email"
                value={currentEmail}
                disabled
                className="text-ocean-300"
              />
            </div>

            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                New Email
              </label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.email@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-ocean-300 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
