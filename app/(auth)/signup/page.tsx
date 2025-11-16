'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Alert } from '@/components/atoms/Alert'
import { GoogleAuthButton } from '@/components/molecules/GoogleAuthButton'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-ocean-950">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircleIcon className="w-20 h-20 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
            <p className="text-ocean-400 mb-6">
              We&apos;ve sent you a confirmation email. Please check your inbox and click the
              verification link to activate your account.
            </p>
            <Link href="/login">
              <Button size="lg" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ocean-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-ocean-400">Join Lumen to track your nutrition</p>
        </div>

        <GoogleAuthButton mode="signup" />

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-ocean-700" />
          <span className="text-sm text-ocean-400">or</span>
          <div className="flex-1 border-t border-ocean-700" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="At least 6 characters"
            helperText="Must be at least 6 characters long"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-ocean-700 bg-ocean-800 text-ocean-400 focus:ring-ocean-500 focus:ring-offset-ocean-900"
              required
            />
            <label htmlFor="terms" className="text-sm text-ocean-400">
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean-300 hover:text-ocean-200 underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean-300 hover:text-ocean-200 underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ocean-400">
            Already have an account?{' '}
            <Link href="/login" className="text-ocean-300 hover:text-ocean-200 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
