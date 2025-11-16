'use client'

import { Component, ReactNode } from 'react'
import { Button } from './atoms/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something broke.</h2>
            <p className="text-ocean-400 mb-6">Try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
