'use client'

import { WriterState } from '@/lib/types'
import { Textarea } from '@/components/ui'
import { Sparkles } from 'lucide-react'

interface StepOneProps {
  state: WriterState
  updateState: (updates: Partial<WriterState>) => void
}

export function StepOne({ state, updateState }: StepOneProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          What are you building? <span className="text-cherry-400">✨</span>
        </h2>
        <p className="text-gray-400">
          Describe your project idea in a few sentences. Be as detailed as possible.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Textarea
            label="Project Title"
            placeholder="e.g., Modern SaaS Dashboard for Team Productivity"
            value={state.title}
            onChange={(e) => updateState({ title: e.target.value })}
            className="text-lg"
            autoFocus
          />
        </div>

        <div>
          <Textarea
            label="Description"
            placeholder="Describe what you want to build. Include key features, target audience, and any specific requirements..."
            value={state.description}
            onChange={(e) => updateState({ description: e.target.value })}
            minRows={6}
            maxRows={12}
            helperText={`${state.description.length} characters`}
          />
        </div>
      </div>

      <div className="bg-dark-700/50 rounded-lg p-4 border border-dark-600">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-cherry-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Tips for better results</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Be specific about features and functionality</li>
              <li>Mention your target audience</li>
              <li>Include any design preferences or constraints</li>
              <li>Describe the problem you're solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

