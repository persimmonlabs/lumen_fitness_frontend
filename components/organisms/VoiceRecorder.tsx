'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/atoms/Button"
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid"
import { api } from "@/lib/api"

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void
}

export function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      console.error('Microphone access denied:', error)
      alert('Microphone access required')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')

      const { data } = await api.post('/meals/parse-voice', formData)
      onTranscriptionComplete(data.transcription || '')
    } catch (error) {
      console.error('Transcription failed:', error)
      alert('Transcription failed. Try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="text-center">
      <Button
        size="lg"
        variant={recording ? "secondary" : "primary"}
        onClick={recording ? stopRecording : startRecording}
        disabled={processing}
        className="w-full"
      >
        {recording ? (
          <>
            <StopIcon className="w-6 h-6 mr-2" />
            Stop Recording
          </>
        ) : processing ? (
          'Processing...'
        ) : (
          <>
            <MicrophoneIcon className="w-6 h-6 mr-2" />
            Hold to Record
          </>
        )}
      </Button>

      {recording && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-ocean-400">Recording...</span>
        </div>
      )}
    </div>
  )
}
