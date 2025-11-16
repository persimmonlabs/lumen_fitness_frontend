'use client'

import Link from 'next/link'
import { LandingNav } from '@/components/organisms/LandingNav'
import { Footer } from '@/components/organisms/Footer'
import { FeatureCard } from '@/components/molecules/FeatureCard'
import { Button } from '@/components/atoms/Button'
import { CameraIcon, ChartBarIcon, FireIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-ocean-900">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-800/30 via-ocean-900 to-ocean-900" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Track nutrition with AI
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-ocean-300 max-w-2xl mx-auto">
            Log meals in seconds. See results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="min-w-[200px]">
              <Button size="lg" variant="primary" className="w-full">
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="min-w-[200px]">
              <Button size="lg" variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CameraIcon className="icon-xl" />}
              title="Photo Logging"
              description="Snap a photo, get instant nutrition breakdown"
            />
            <FeatureCard
              icon={<ChartBarIcon className="icon-xl" />}
              title="Track Progress"
              description="Track your progress with simple, clear charts"
            />
            <FeatureCard
              icon={<FireIcon className="icon-xl" />}
              title="Achieve Goals"
              description="Set targets and hit them consistently"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
