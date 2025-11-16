'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { ChangeEmailForm } from '@/components/molecules/ChangeEmailForm'
import { ChangePasswordForm } from '@/components/molecules/ChangePasswordForm'
import { DeleteAccountModal } from '@/components/molecules/DeleteAccountModal'
import { DataExportButton } from '@/components/molecules/DataExportButton'
import { NotificationPreferences } from '@/components/molecules/NotificationPreferences'
import { useAppSelector } from '@/store'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [linkingGoogle, setLinkingGoogle] = useState(false)

  const { user } = useAppSelector((state) => state.auth)

  const authProvider = user?.app_metadata?.provider || 'email'
  const isGoogleConnected = authProvider === 'google'
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || 'No email'

  const handleConnectGoogle = async () => {
    setLinkingGoogle(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google linking error:', error)
      setLinkingGoogle(false)
    }
  }

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Account Information */}
      <Card>
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-ocean-400">Email</p>
              <p className="text-sm">{userEmail}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEmailForm(true)}
              disabled={isGoogleConnected}
            >
              {isGoogleConnected ? 'Managed by Google' : 'Change'}
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-ocean-400">Name</p>
              <p className="text-sm">{userName}</p>
            </div>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <h3 className="font-semibold mb-4">Connected Accounts</h3>
        <div className="space-y-3">
          {isGoogleConnected ? (
            <div className="flex items-center justify-between p-3 bg-ocean-700 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-ocean-400">{userEmail}</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium">Connected</span>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogle}
              disabled={linkingGoogle}
              className="w-full flex items-center justify-center gap-3 p-3 border-2 border-ocean-700 rounded-lg hover:bg-ocean-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-medium">
                {linkingGoogle ? 'Connecting...' : 'Connect Google Account'}
              </span>
            </button>
          )}
        </div>
        <p className="text-caption mt-3">
          Linking your Google account allows you to sign in with either email/password or Google.
        </p>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="font-semibold mb-4">Security</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-ocean-400">Password</p>
              <p className="text-sm">••••••••</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPasswordForm(true)}
            >
              Change
            </Button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h3 className="font-semibold mb-4">Notification Preferences</h3>
        <NotificationPreferences />
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-ocean-400">Export Your Data</p>
              <p className="text-caption">Download all your data as JSON</p>
            </div>
            <DataExportButton />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card variant="outlined" className="border-2 border-red-900/50">
        <h3 className="font-semibold mb-2 text-red-400">Danger Zone</h3>
        <p className="text-sm text-ocean-400 mb-4">
          Irreversible and destructive actions
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-red-400">Delete Account</p>
              <p className="text-caption">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {showEmailForm && (
        <ChangeEmailForm onClose={() => setShowEmailForm(false)} />
      )}
      {showPasswordForm && (
        <ChangePasswordForm onClose={() => setShowPasswordForm(false)} />
      )}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  )
}
