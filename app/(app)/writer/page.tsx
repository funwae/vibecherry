'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent } from '@/components/ui'
import { StepOne } from '@/components/Writer/StepOne'
import { StepTwo } from '@/components/Writer/StepTwo'
import { StepThree } from '@/components/Writer/StepThree'
import { StepFour } from '@/components/Writer/StepFour'
import { StepFive } from '@/components/Writer/StepFive'
import { WriterState } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const initialWriterState: WriterState = {
  step: 1,
  title: '',
  description: '',
  category: null,
  specType: 'markdown',
  vibe: 'modern',
  features: [],
  pages: [],
  difficulty: null,
  tags: [],
}

export default function WriterPage() {
  const router = useRouter()
  const [state, setState] = useState<WriterState>(initialWriterState)
  const [generatedSpec, setGeneratedSpec] = useState<string>('')

  const updateState = (updates: Partial<WriterState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (state.step < 5) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const prevStep = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const canProceed = () => {
    switch (state.step) {
      case 1:
        return state.title.trim().length > 0 && state.description.trim().length > 0
      case 2:
        return state.category !== null && state.pages.length > 0
      case 3:
        return true // Vibe is always selected (has default)
      case 4:
        return generatedSpec.length > 0
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <StepOne state={state} updateState={updateState} />
      case 2:
        return <StepTwo state={state} updateState={updateState} />
      case 3:
        return <StepThree state={state} updateState={updateState} />
      case 4:
        return (
          <StepFour
            state={state}
            updateState={updateState}
            generatedSpec={generatedSpec}
            setGeneratedSpec={setGeneratedSpec}
          />
        )
      case 5:
        return (
          <StepFive
            state={state}
            generatedSpec={generatedSpec}
            onNewSpec={() => {
              setState(initialWriterState)
              setGeneratedSpec('')
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/feed')}
            className="text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Feed
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">The Writer</h1>
          <p className="text-gray-400">Create a detailed specification with AI</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      state.step >= step
                        ? 'bg-cherry-500 text-white'
                        : 'bg-dark-700 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                  <div className="mt-2 text-xs text-center text-gray-400 max-w-[80px]">
                    {step === 1 && 'Idea'}
                    {step === 2 && 'Structure'}
                    {step === 3 && 'Style'}
                    {step === 4 && 'Generate'}
                    {step === 5 && 'Download'}
                  </div>
                </div>
                {index < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-colors ${
                      state.step > step ? 'bg-cherry-500' : 'bg-dark-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        {state.step < 5 && (
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={state.step === 1}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {state.step === 4 ? 'Continue' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

