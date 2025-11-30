'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { SpecCard } from '@/components/Feed/SpecCard'
import { FilterPanel } from '@/components/Feed/FilterPanel'
import { Search, Grid, List } from 'lucide-react'
import { Spec, CATEGORIES, DIFFICULTIES, VIBES } from '@/lib/types'

type ViewMode = 'grid' | 'list'
type SortOption = 'recent' | 'popular' | 'downloads'

export default function FeedPage() {
  const router = useRouter()
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<SortOption>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    vibe: '',
    tags: [] as string[],
    featured: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  const fetchSpecs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.difficulty) params.set('difficulty', filters.difficulty)
      if (filters.vibe) params.set('vibe', filters.vibe)
      if (searchQuery) params.set('search', searchQuery)
      if (filters.featured) params.set('featured', 'true')
      params.set('sort', sort)
      params.set('limit', '20')

      const response = await fetch(`/api/feed?${params.toString()}`)
      const data = await response.json()
      setSpecs(data.specs || [])
    } catch (error) {
      console.error('Error fetching specs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecs()
  }, [filters, sort, searchQuery])

  const handleUpvote = async (specId: string) => {
    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec_id: specId }),
      })

      if (response.ok) {
        // Refresh specs
        fetchSpecs()
      }
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Browse Specs</h1>
          <p className="text-gray-400">Discover and download battle-tested specifications</p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search specs, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <div className="flex gap-2 border border-dark-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cherry-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-cherry-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-dark-800 border border-dark-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cherry-500"
            >
              <option value="recent">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        {/* Specs Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cherry-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Loading specs...</p>
          </div>
        ) : specs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">No specs found</p>
              <Button onClick={() => router.push('/writer')}>
                Create Your First Spec
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {specs.map((spec) => (
              <SpecCard
                key={spec.id}
                spec={spec}
                viewMode={viewMode}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

