'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Alert } from '@/components/atoms/Alert'
import { GoogleAuthButton } from '@/components/molecules/GoogleAuthButton'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/home')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ocean-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-ocean-400">Sign in to your Lumen account</p>
        </div>

        <GoogleAuthButton mode="signin" />

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-ocean-700" />
          <span className="text-sm text-ocean-400">or</span>
          <div className="flex-1 border-t border-ocean-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/forgot-password" className="text-sm text-ocean-400 hover:text-ocean-300 block">
            Forgot password?
          </Link>
          <p className="text-sm text-ocean-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-ocean-300 hover:text-ocean-200 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
