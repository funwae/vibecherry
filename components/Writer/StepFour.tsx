'use client'

import { useState, useEffect, useCallback } from 'react'
import { WriterState } from '@/lib/types'
import { Button, Card, CardContent } from '@/components/ui'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface StepFourProps {
  state: WriterState
  updateState: (updates: Partial<WriterState>) => void
  generatedSpec: string
  setGeneratedSpec: (spec: string) => void
}

export function StepFour({
  state,
  updateState,
  generatedSpec,
  setGeneratedSpec,
}: StepFourProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState<string>('')

  const stages = [
    'Analyzing requirements...',
    'Structuring specification...',
    'Adding implementation details...',
    'Polishing output...',
  ]

  const generateSpec = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    setStage(stages[0])

    try {
      const response = await fetch('/api/writer/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: state.title,
          description: state.description,
          category: state.category,
          specType: state.specType,
          vibe: state.vibe,
          features: state.features,
          pages: state.pages,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate spec')
      }

      const data = await response.json()
      setGeneratedSpec(data.spec)
      setStage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate spec')
    } finally {
      setIsGenerating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.title, state.description, state.category, state.specType, state.vibe, state.features, state.pages])

  useEffect(() => {
    if (state.step === 4 && !generatedSpec && !isGenerating) {
      generateSpec()
    }
  }, [state.step, generatedSpec, isGenerating, generateSpec])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Generate Your Spec</h2>
        <p className="text-gray-400">
          AI is creating your detailed specification based on your inputs.
        </p>
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-12 h-12 text-cherry-400 animate-spin mx-auto mb-4" />
            <p className="text-white font-medium mb-2">{stage}</p>
            <p className="text-sm text-gray-400">This may take a moment...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium mb-1">Generation Failed</h3>
                <p className="text-sm text-red-300">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={generateSpec}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedSpec && !isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Spec generated successfully!</span>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {generatedSpec}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={generateSpec} variant="outline" size="sm">
              Regenerate
            </Button>
          </div>
        </div>
      )}

      {!generatedSpec && !isGenerating && !error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-400">Click the button below to generate your spec.</p>
            <Button onClick={generateSpec} className="mt-4">
              Generate Spec
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

