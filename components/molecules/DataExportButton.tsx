'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'

export function DataExportButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setError(null)
    setLoading(true)

    try {
      // Fetch user data from backend
      const response = await fetch('/api/v1/users/me/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      const data = await response.json()

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const date = new Date().toISOString().split('T')[0]
      a.download = `lumen-data-export-${date}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success toast (you can implement a proper toast system)
      alert('Data exported successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data')
      alert('Failed to export data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export'}
      </Button>
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}
