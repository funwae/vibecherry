'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { Plus, Folder, Trash2, Eye } from 'lucide-react'
import { Collection } from '@/lib/types'
import Link from 'next/link'

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newCollection, setNewCollection] = useState({ name: '', description: '', is_public: true })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      })

      if (response.ok) {
        setShowCreate(false)
        setNewCollection({ name: '', description: '', is_public: true })
        fetchCollections()
      }
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  const deleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const response = await fetch(`/api/collections?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCollections()
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cherry-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Collections</h1>
            <p className="text-gray-400">Organize your favorite specs</p>
          </div>
          <Button
            onClick={() => setShowCreate(!showCreate)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Collection
          </Button>
        </div>

        {showCreate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createCollection} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="My Awesome Collection"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="A collection of my favorite specs..."
                  value={newCollection.description}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, description: e.target.value })
                  }
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={newCollection.is_public}
                    onChange={(e) =>
                      setNewCollection({ ...newCollection, is_public: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-cherry-500"
                  />
                  <label htmlFor="is_public" className="text-sm text-gray-300">
                    Make this collection public
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Create</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCreate(false)
                      setNewCollection({ name: '', description: '', is_public: true })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {collections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No collections yet</p>
              <Button onClick={() => setShowCreate(true)}>Create Your First Collection</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} variant="interactive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{collection.name}</CardTitle>
                      {collection.description && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteCollection(collection.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {collection.spec_count || 0} specs
                    </span>
                    <Link href={`/collections/${collection.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

