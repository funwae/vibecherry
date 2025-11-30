'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, CardContent } from '@/components/ui'
import { Heart, Download, Calendar, User, ArrowLeft, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Spec } from '@/lib/types'
import ReactMarkdown from 'react-markdown'

export default function SpecDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [spec, setSpec] = useState<Spec | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const fetchSpec = useCallback(async () => {
    try {
      const response = await fetch(`/api/specs?id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSpec(data)
      }
    } catch (error) {
      console.error('Error fetching spec:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchSpec()
  }, [fetchSpec])

  const handleUpvote = async () => {
    if (!spec) return
    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec_id: spec.id }),
      })

      if (response.ok) {
        fetchSpec()
      }
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  const handleDownload = () => {
    if (!spec) return
    const blob = new Blob([spec.content], {
      type: spec.spec_type === 'markdown' ? 'text/markdown' : 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${spec.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${
      spec.spec_type === 'markdown' ? 'md' : 'json'
    }`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!spec) return
    await navigator.clipboard.writeText(spec.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cherry-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading spec...</p>
        </div>
      </div>
    )
  }

  if (!spec) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-400 mb-4">Spec not found</p>
            <Button onClick={() => router.push('/feed')}>Back to Feed</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-6"
        >
          Back
        </Button>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-4">{spec.title}</h1>
              {spec.description && (
                <p className="text-xl text-gray-400 mb-6">{spec.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="inline-flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {spec.profile?.username || 'Anonymous'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDistanceToNow(new Date(spec.created_at), { addSuffix: true })}
                </span>
                <span className="capitalize">{spec.category.replace('-', ' ')}</span>
                <span className="capitalize">{spec.difficulty}</span>
                {spec.vibe && <span className="capitalize">{spec.vibe}</span>}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUpvote}
                  variant={spec.has_upvoted ? 'primary' : 'outline'}
                  leftIcon={<Heart className={`w-4 h-4 ${spec.has_upvoted ? 'fill-current' : ''}`} />}
                >
                  {spec.upvote_count} Upvotes
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            {spec.spec_type === 'markdown' ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{spec.content}</ReactMarkdown>
              </div>
            ) : (
              <pre className="bg-dark-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
                {JSON.stringify(JSON.parse(spec.content), null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

