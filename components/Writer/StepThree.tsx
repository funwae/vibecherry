'use client'

import { WriterState, VIBES } from '@/lib/types'
import { Button } from '@/components/ui'

interface StepThreeProps {
  state: WriterState
  updateState: (updates: Partial<WriterState>) => void
}

const VIBE_DESCRIPTIONS: Record<string, string> = {
  minimal: 'Clean, focused, lots of whitespace',
  playful: 'Fun, colorful, personality-driven',
  corporate: 'Professional, trustworthy, enterprise-ready',
  experimental: 'Cutting-edge, bold, unconventional',
  retro: 'Nostalgic, pixel art, vintage aesthetics',
  modern: 'Contemporary, glassmorphism, gradients',
  elegant: 'Sophisticated, refined, premium feel',
  bold: 'Vibrant, high contrast, attention-grabbing',
}

export function StepThree({ state, updateState }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Style & Vibe</h2>
        <p className="text-gray-400">
          Choose the visual direction and tone for your project.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Vibe
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() => updateState({ vibe })}
              className={`p-4 rounded-lg border-2 transition-all text-left capitalize ${
                state.vibe === vibe
                  ? 'border-cherry-500 bg-cherry-500/10 text-white'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500 text-gray-300'
              }`}
            >
              <div className="font-medium mb-1">{vibe}</div>
              <div className="text-xs text-gray-400">
                {VIBE_DESCRIPTIONS[vibe] || 'Custom style'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Spec Format
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateState({ specType: 'markdown' })}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              state.specType === 'markdown'
                ? 'border-cherry-500 bg-cherry-500/10 text-white'
                : 'border-dark-600 bg-dark-700 hover:border-dark-500 text-gray-300'
            }`}
          >
            <div className="font-medium mb-1">Markdown</div>
            <div className="text-xs text-gray-400">
              Human-readable, easy to edit
            </div>
          </button>
          <button
            onClick={() => updateState({ specType: 'json' })}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              state.specType === 'json'
                ? 'border-cherry-500 bg-cherry-500/10 text-white'
                : 'border-dark-600 bg-dark-700 hover:border-dark-500 text-gray-300'
            }`}
          >
            <div className="font-medium mb-1">JSON</div>
            <div className="text-xs text-gray-400">
              Structured, machine-readable
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

