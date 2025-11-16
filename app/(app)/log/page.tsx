'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Alert } from "@/components/atoms/Alert"
import { PhotoCapture } from "@/components/organisms/PhotoCapture"
import { VoiceRecorder } from "@/components/organisms/VoiceRecorder"
import { MealConfirm } from "@/components/organisms/MealConfirm"
import { getRandomLoadingMessage } from "@/lib/utils"
import { CameraIcon, PencilIcon, MicrophoneIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import { useParseMealMutation, useConfirmMealMutation } from "@/store/api/mealsApi"

type LogMode = 'select' | 'photo' | 'text' | 'voice' | 'confirm' | 'manual'

function LogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<LogMode>('select')
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [draft, setDraft] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [parseMeal] = useParseMealMutation()
  const [confirmMeal] = useConfirmMealMutation()

  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'text' || modeParam === 'voice' || modeParam === 'manual') {
      setMode(modeParam as LogMode)
    }
  }, [searchParams])

  const handlePhotoCapture = async (url: string, thumbnailUrl: string) => {
    setLoading(true)
    setLoadingMessage(getRandomLoadingMessage())
    setError(null)

    try {
      const result = await parseMeal({ photo_url: url }).unwrap()
      setDraft({
        ...result,
        photo_url: url,
        thumbnail_url: thumbnailUrl,
      })
      setMode('confirm')
    } catch (err: any) {
      console.error('Failed to parse meal from photo:', err)
      setError(err?.data?.message || 'Failed to analyze photo. Please try again.')
      setMode('select')
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return

    setLoading(true)
    setLoadingMessage(getRandomLoadingMessage())
    setError(null)

    try {
      const result = await parseMeal({ description: textInput }).unwrap()
      setDraft(result)
      setMode('confirm')
    } catch (err: any) {
      console.error('Failed to parse meal from text:', err)
      setError(err?.data?.message || 'Failed to analyze meal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceTranscription = async (text: string) => {
    setTextInput(text)
    setLoading(true)
    setLoadingMessage(getRandomLoadingMessage())
    setError(null)

    try {
      const result = await parseMeal({ description: text }).unwrap()
      setDraft(result)
      setMode('confirm')
    } catch (err: any) {
      console.error('Failed to parse meal from voice:', err)
      setError(err?.data?.message || 'Failed to analyze meal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (items: any[]) => {
    if (!draft?.id) {
      console.error('No draft ID available')
      return
    }

    try {
      await confirmMeal({ id: draft.id, items }).unwrap()
      router.push('/home')
    } catch (err: any) {
      console.error('Failed to save meal:', err)
      setError(err?.data?.message || 'Failed to save meal. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-400 mx-auto mb-4" />
          <p className="text-ocean-300">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (mode === 'photo') {
    return (
      <PhotoCapture
        onPhotoCapture={handlePhotoCapture}
        onCancel={() => setMode('select')}
      />
    )
  }

  if (mode === 'confirm' && draft) {
    return (
      <MealConfirm
        draft={draft}
        onConfirm={handleConfirm}
        onCancel={() => setMode('select')}
      />
    )
  }

  if (mode === 'text') {
    return (
      <div className="p-6 pb-24">
        <h2 className="text-2xl font-bold mb-6">Describe Your Meal</h2>
        <Input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="e.g., Grilled chicken breast with rice and broccoli"
          className="mb-4"
        />
        <p className="text-sm text-ocean-400 mb-6">
          Be specific for better accuracy
        </p>
        <Button
          size="lg"
          className="w-full"
          onClick={handleTextSubmit}
          disabled={!textInput.trim()}
        >
          Continue
        </Button>
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => setMode('select')}
        >
          Cancel
        </Button>
      </div>
    )
  }

  if (mode === 'voice') {
    return (
      <div className="p-6 pb-24">
        <h2 className="text-2xl font-bold mb-6">Voice Description</h2>
        <p className="text-sm text-ocean-400 mb-6">
          Describe your meal clearly
        </p>
        <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => setMode('select')}
        >
          Cancel
        </Button>
      </div>
    )
  }

  if (mode === 'manual') {
    router.push('/log/manual')
    return null
  }

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold mb-6">Log a Meal</h2>
      <p className="text-ocean-400 mb-8">Choose how you'd like to log</p>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full justify-start gap-4"
          onClick={() => setMode('photo')}
          leftIcon={<CameraIcon className="icon-md" />}
        >
          Take Photo
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="w-full justify-start gap-4"
          onClick={() => setMode('text')}
          leftIcon={<PencilIcon className="icon-md" />}
        >
          Type Description
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="w-full justify-start gap-4"
          onClick={() => setMode('voice')}
          leftIcon={<MicrophoneIcon className="icon-md" />}
        >
          Voice Description
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="w-full justify-start gap-4"
          onClick={() => setMode('manual')}
          leftIcon={<DocumentTextIcon className="icon-md" />}
        >
          Manual Entry
        </Button>
      </div>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-400" /></div>}>
      <LogPageContent />
    </Suspense>
  )
}
