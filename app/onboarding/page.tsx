'use client'

import { useState } from "react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { useRouter } from "next/navigation"
import { useUpdateUserGoalsMutation } from "@/store/api/userApi"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    goal: '',
    calories: 0,
    protein: 0,
    weight: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [updateGoals, { isLoading }] = useUpdateUserGoalsMutation()

  const steps = [
    {
      title: "Welcome to Lumen",
      description: "Track your nutrition with AI-powered meal logging",
      content: null,
    },
    {
      title: "What's your goal?",
      description: "Choose your primary goal",
      content: (
        <div className="space-y-3">
          {['Lose Weight', 'Maintain Weight', 'Build Muscle'].map((goal) => (
            <Button
              key={goal}
              size="lg"
              variant={data.goal === goal ? 'primary' : 'secondary'}
              className="w-full"
              onClick={() => setData({ ...data, goal })}
            >
              {goal}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "Daily calorie target",
      description: "How many calories per day?",
      content: (
        <Input
          type="number"
          value={data.calories || ''}
          onChange={(e) => setData({ ...data, calories: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 2000"
        />
      ),
    },
    {
      title: "Daily protein target",
      description: "How many grams of protein?",
      content: (
        <Input
          type="number"
          value={data.protein || ''}
          onChange={(e) => setData({ ...data, protein: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 150"
        />
      ),
    },
    {
      title: "Current weight",
      description: "In kilograms",
      content: (
        <Input
          type="number"
          value={data.weight || ''}
          onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 75"
        />
      ),
    },
  ]

  const currentStep = steps[step]
  const canContinue =
    step === 0 ||
    (step === 1 && data.goal) ||
    (step === 2 && data.calories > 0) ||
    (step === 3 && data.protein > 0) ||
    (step === 4 && data.weight > 0)

  const handleContinue = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setError(null)
      try {
        // Save user goals
        await updateGoals({
          goal_type: data.goal,
          calories_target: data.calories,
          protein_target: data.protein,
          starting_weight: data.weight,
        }).unwrap()

        // Mark onboarding as completed in database
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          await supabase
            .from('users')
            .update({
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString()
            })
            .eq('id', user.id)
        }

        router.push('/home')
      } catch (err: any) {
        console.error('Failed to save onboarding data:', err)
        setError(err?.data?.message || 'Failed to save your goals. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{currentStep.title}</h1>
          <p className="text-ocean-400">{currentStep.description}</p>
        </div>

        <div className="mb-12">
          {currentStep.content}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-ocean-400' : 'bg-ocean-800'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : (step === steps.length - 1 ? 'Get Started' : 'Continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
