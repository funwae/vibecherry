'use client'

import { Spec } from '@/lib/types'
import { Card, CardContent } from '@/components/ui'
import { Heart, Download, Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

interface SpecCardProps {
  spec: Spec
  viewMode: 'grid' | 'list'
  onUpvote: (specId: string) => void
}

export function SpecCard({ spec, viewMode, onUpvote }: SpecCardProps) {
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onUpvote(spec.id)
  }

  if (viewMode === 'list') {
    return (
      <Card variant="interactive" className="hover:border-cherry-500/50">
        <Link href={`/specs/${spec.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {spec.screenshot_url && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700">
                  <Image
                    src={spec.screenshot_url}
                    alt={spec.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {spec.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {spec.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleUpvote}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-colors ${
                    spec.has_upvoted
                      ? 'bg-cherry-500/20 text-cherry-400'
                      : 'bg-dark-700 text-gray-400 hover:text-cherry-400'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${spec.has_upvoted ? 'fill-current' : ''}`}
                  />
                </button>
                <span className="text-sm text-gray-400">{spec.upvote_count}</span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {spec.download_count}
                </span>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <Card variant="interactive" className="hover:border-cherry-500/50">
      <Link href={`/specs/${spec.id}`}>
        <div className="relative aspect-video bg-dark-700 rounded-t-xl overflow-hidden">
          {spec.screenshot_url ? (
            <Image
              src={spec.screenshot_url}
              alt={spec.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <span className="text-4xl">📄</span>
            </div>
          )}
          {spec.is_featured && (
            <div className="absolute top-2 right-2 bg-cherry-500 text-white text-xs px-2 py-1 rounded-full">
              ⭐ Featured
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {spec.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {spec.description || 'No description'}
          </p>
            <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              <button
                onClick={handleUpvote}
                onMouseDown={(e) => e.preventDefault()}
                className={`inline-flex items-center gap-1 transition-colors ${
                  spec.has_upvoted
                    ? 'text-cherry-400'
                    : 'text-gray-500 hover:text-cherry-400'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${spec.has_upvoted ? 'fill-current' : ''}`}
                />
                {spec.upvote_count}
              </button>
              <span className="inline-flex items-center gap-1">
                <Download className="w-4 h-4" />
                {spec.download_count}
              </span>
            </div>
            <span className="text-xs text-gray-500 capitalize">
              {spec.category.replace('-', ' ')}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

