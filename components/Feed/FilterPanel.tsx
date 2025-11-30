'use client'

import { Card, CardContent, Button } from '@/components/ui'
import { CATEGORIES, DIFFICULTIES, VIBES } from '@/lib/types'
import { X } from 'lucide-react'

interface FilterPanelProps {
  filters: {
    category: string
    difficulty: string
    vibe: string
    tags: string[]
    featured: boolean
  }
  onFiltersChange: (filters: any) => void
  onClose: () => void
}

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      difficulty: '',
      vibe: '',
      tags: [],
      featured: false,
    })
  }

  const hasActiveFilters =
    filters.category ||
    filters.difficulty ||
    filters.vibe ||
    filters.tags.length > 0 ||
    filters.featured

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    updateFilter('category', filters.category === cat.value ? '' : cat.value)
                  }
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    filters.category === cat.value
                      ? 'bg-cherry-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() =>
                    updateFilter(
                      'difficulty',
                      filters.difficulty === diff.value ? '' : diff.value
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filters.difficulty === diff.value
                      ? 'bg-cherry-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Vibe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {VIBES.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() =>
                    updateFilter('vibe', filters.vibe === vibe ? '' : vibe)
                  }
                  className={`p-2 rounded-lg text-sm capitalize transition-colors ${
                    filters.vibe === vibe
                      ? 'bg-cherry-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => updateFilter('featured', e.target.checked)}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-cherry-500 focus:ring-cherry-500"
              />
              <span className="text-sm text-gray-300">Featured only</span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

