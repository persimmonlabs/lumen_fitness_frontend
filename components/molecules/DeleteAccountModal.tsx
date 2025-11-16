'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { supabase } from '@/lib/supabase'

interface DeleteAccountModalProps {
  onClose: () => void
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter()
  const [understood, setUnderstood] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false)

  const isConfirmed = understood && confirmText === 'DELETE'

  const handleDelete = async () => {
    if (!isConfirmed) return

    setError(null)
    setLoading(true)

    try {
      // Call backend to delete account
      const response = await fetch('/api/v1/users/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Sign out the user
      await supabase.auth.signOut()

      // Redirect to landing page
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setLoading(false)
    }
  }

  if (showFinalConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-ocean-800 rounded-lg p-6 max-w-md w-full border-2 border-red-900/50">
          <h3 className="text-xl font-bold mb-4 text-red-400">
            Final Confirmation
          </h3>

          <p className="text-sm text-ocean-300 mb-6">
            Are you absolutely sure? This will immediately delete your account and all
            associated data. This action cannot be undone.
          </p>

          {error && (
            <div className="bg-red-950/50 border border-red-900 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowFinalConfirmation(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ocean-800 rounded-lg p-6 max-w-md w-full border-2 border-red-900/50">
        <h3 className="text-xl font-bold mb-4 text-red-400">Delete Account</h3>

        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm font-semibold mb-2">
            Warning: This action is permanent and cannot be undone
          </p>
          <p className="text-ocean-300 text-sm">
            Deleting your account will permanently remove:
          </p>
          <ul className="list-disc list-inside text-ocean-400 text-sm mt-2 space-y-1">
            <li>All your meal logs and nutrition data</li>
            <li>Weight tracking history</li>
            <li>Goals and preferences</li>
            <li>Account information</li>
          </ul>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-ocean-300">
              I understand that my data will be permanently deleted and this action
              cannot be undone
            </span>
          </label>

          <div>
            <label className="block text-sm text-ocean-400 mb-1">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-ocean-900 border border-ocean-700 rounded-lg px-4 py-2"
              disabled={!understood}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setShowFinalConfirmation(true)}
            disabled={!isConfirmed}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-ocean-700 disabled:text-ocean-500"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
