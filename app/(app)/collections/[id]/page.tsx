'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { SpecCard } from '@/components/Feed/SpecCard'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Spec, Collection } from '@/lib/types'

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollection()
  }, [params.id])

  const fetchCollection = async () => {
    try {
      const response = await fetch(`/api/collections?id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCollection(data)
        setSpecs(data.specs || [])
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeSpec = async (specId: string) => {
    try {
      const response = await fetch(
        `/api/collections/specs?collection_id=${params.id}&spec_id=${specId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setSpecs(specs.filter((s) => s.id !== specId))
      }
    } catch (error) {
      console.error('Error removing spec:', error)
    }
  }

  const handleUpvote = async (specId: string) => {
    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec_id: specId }),
      })

      if (response.ok) {
        fetchCollection()
      }
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cherry-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading collection...</p>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-400 mb-4">Collection not found</p>
            <Button onClick={() => router.push('/collections')}>Back to Collections</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/collections')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-6"
        >
          Back to Collections
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{collection.name}</CardTitle>
            {collection.description && (
              <p className="text-gray-400 mt-2">{collection.description}</p>
            )}
          </CardHeader>
        </Card>

        {specs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">No specs in this collection yet</p>
              <Button onClick={() => router.push('/feed')}>Browse Specs</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((spec) => (
              <div key={spec.id} className="relative">
                <SpecCard spec={spec} viewMode="grid" onUpvote={handleUpvote} />
                <button
                  onClick={() => removeSpec(spec.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  title="Remove from collection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

