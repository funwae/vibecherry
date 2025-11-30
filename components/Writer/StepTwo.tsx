'use client'

import { useState } from 'react'
import { WriterState, CATEGORIES, DIFFICULTIES } from '@/lib/types'
import { Button, Input } from '@/components/ui'
import { X, Plus } from 'lucide-react'

interface StepTwoProps {
  state: WriterState
  updateState: (updates: Partial<WriterState>) => void
}

const COMMON_PAGES: Record<string, string[]> = {
  'landing-page': ['Home', 'About', 'Features', 'Pricing', 'Contact'],
  'saas-dashboard': ['Dashboard', 'Analytics', 'Settings', 'Team', 'Billing'],
  'e-commerce': ['Home', 'Shop', 'Product', 'Cart', 'Checkout', 'Account'],
  'portfolio': ['Home', 'Work', 'About', 'Contact'],
  'blog': ['Home', 'Posts', 'Categories', 'About'],
  'api-docs': ['Overview', 'Getting Started', 'Endpoints', 'Examples'],
}

const COMMON_FEATURES: Record<string, string[]> = {
  'landing-page': ['Hero Section', 'Feature Grid', 'Testimonials', 'CTA Section', 'Footer'],
  'saas-dashboard': ['User Authentication', 'Data Visualization', 'User Management', 'Settings Panel'],
  'e-commerce': ['Product Catalog', 'Shopping Cart', 'Checkout', 'User Accounts', 'Payment Processing'],
}

export function StepTwo({ state, updateState }: StepTwoProps) {
  const [newPage, setNewPage] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const addPage = () => {
    if (newPage.trim() && !state.pages.includes(newPage.trim())) {
      updateState({ pages: [...state.pages, newPage.trim()] })
      setNewPage('')
    }
  }

  const removePage = (page: string) => {
    updateState({ pages: state.pages.filter((p) => p !== page) })
  }

  const toggleFeature = (feature: string) => {
    if (state.features.includes(feature)) {
      updateState({ features: state.features.filter((f) => f !== feature) })
    } else {
      updateState({ features: [...state.features, feature] })
    }
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !state.features.includes(newFeature.trim())) {
      updateState({ features: [...state.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const suggestedPages = state.category ? COMMON_PAGES[state.category] || [] : []
  const suggestedFeatures = state.category ? COMMON_FEATURES[state.category] || [] : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Project Structure</h2>
        <p className="text-gray-400">Define the category, pages, and features of your project.</p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                updateState({ category: cat.value })
                // Auto-suggest pages for this category
                if (COMMON_PAGES[cat.value] && state.pages.length === 0) {
                  updateState({ pages: COMMON_PAGES[cat.value].slice(0, 3) })
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                state.category === cat.value
                  ? 'border-cherry-500 bg-cherry-500/10 text-white'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500 text-gray-300'
              }`}
            >
              <div className="font-medium">{cat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.value}
              onClick={() => updateState({ difficulty: diff.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                state.difficulty === diff.value
                  ? 'border-cherry-500 bg-cherry-500/10 text-white'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500 text-gray-300'
              }`}
            >
              <div className="font-medium mb-1">{diff.label}</div>
              <div className="text-xs text-gray-400">{diff.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Pages
        </label>
        {suggestedPages.length > 0 && state.pages.length === 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedPages.map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!state.pages.includes(page)) {
                    updateState({ pages: [...state.pages, page] })
                  }
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {page}
              </Button>
            ))}
          </div>
        )}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a page..."
            value={newPage}
            onChange={(e) => setNewPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addPage()
              }
            }}
            className="flex-1"
          />
          <Button onClick={addPage} size="md">
            Add
          </Button>
        </div>
        {state.pages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {state.pages.map((page) => (
              <div
                key={page}
                className="inline-flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg text-sm"
              >
                <span>{page}</span>
                <button
                  onClick={() => removePage(page)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Features
        </label>
        {suggestedFeatures.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedFeatures.map((feature) => (
              <Button
                key={feature}
                variant={state.features.includes(feature) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </Button>
            ))}
          </div>
        )}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a custom feature..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomFeature()
              }
            }}
            className="flex-1"
          />
          <Button onClick={addCustomFeature} size="md">
            Add
          </Button>
        </div>
        {state.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {state.features.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center gap-2 bg-cherry-500/20 border border-cherry-500/30 px-3 py-1.5 rounded-lg text-sm text-cherry-300"
              >
                <span>{feature}</span>
                <button
                  onClick={() => toggleFeature(feature)}
                  className="text-cherry-400 hover:text-cherry-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

