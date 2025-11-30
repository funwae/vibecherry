# Implementation Example

> **How These Specs Translate to Actual Code**

This document shows how the detailed specifications map to real implementation. Use this as a reference when building from the specs.

## Example: Spec Card from Feed

### From Spec (docs/specs/04-FEED-BROWSE.md)

```
The spec card should:
- Show screenshot with lazy loading
- Display title, description, tags
- Show upvote count, downloads, date
- Animate on hover (-8px lift, shadow)
- Show quick actions on hover
- Link to creator profile
```

### Implementation

```tsx
// components/SpecCard.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Download, Eye, Calendar } from 'lucide-react'
import { Spec } from '@/lib/types'
import { Acidentiton } from '@/components/Acidentiton'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatDate, truncate } from '@/lib/utils'

interface SpecCardProps {
  spec: Spec
  onClick?: () => void
  onUpvote: (specId: string) => void
  onSave: (specId: string) => void
}

export function SpecCard({ spec, onClick, onUpvote, onSave }: SpecCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={{
        rest: { 
          y: 0,
          boxShadow: '0 0 0 rgba(244, 63, 94, 0)',
        },
        hover: { 
          y: -8,
          boxShadow: '0 10px 30px rgba(244, 63, 94, 0.2)',
        },
      }}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      {/* Screenshot */}
      <div className="relative aspect-video bg-dark-800">
        <Image
          src={spec.screenshot_url || '/placeholder.png'}
          alt={spec.title}
          fill
          className="object-cover"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {spec.is_featured && (
            <Badge variant="featured">⭐ Featured</Badge>
          )}
          {isNew(spec.created_at) && (
            <Badge variant="new">New</Badge>
          )}
        </div>
        
        {/* Quick Actions (show on hover) */}
        <motion.div
          className="absolute top-3 right-3 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <IconButton
            icon={<Eye />}
            label="Quick preview"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickPreview()
            }}
          />
          <IconButton
            icon={<Download />}
            label="Download"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-white">
            {spec.title}
          </h3>
          <DifficultyBadge level={spec.difficulty} />
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4">
          {truncate(spec.description, 100)}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {spec.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {spec.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{spec.tags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote(spec.id)
            }}
            className="flex items-center gap-1 hover:text-cherry-400 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${
                spec.has_upvoted 
                  ? 'fill-current text-cherry-500' 
                  : ''
              }`}
            />
            {formatNumber(spec.upvote_count)}
          </button>
          
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {formatNumber(spec.download_count)}
          </span>
          
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(spec.created_at)}
          </span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 pb-6">
        <Link
          href={`/profile/${spec.profile.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 hover:text-cherry-400 transition-colors"
        >
          <Acidentiton 
            seed={spec.profile.acidentiton_seed} 
            size={24}
          />
          <span className="text-sm text-gray-400">
            @{spec.profile.username}
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

// Helper functions
function isNew(createdAt: string): boolean {
  const daysSince = differenceInDays(new Date(), new Date(createdAt))
  return daysSince <= 7
}
```

## Example: Streaming AI Generation from The Writer

### From Spec (docs/specs/03-THE-WRITER.md)

```
The Writer should:
- Stream AI generation in real-time
- Show progress indicators
- Calculate quality score during generation
- Allow section regeneration
- Update UI optimistically
```

### Implementation

```tsx
// app/writer/components/GenerationStep.tsx
'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { motion } from 'framer-motion'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { QualityScore } from '@/components/QualityScore'

export function GenerationStep({ params }: { params: GenerateParams }) {
  const [streamingContent, setStreamingContent] = useState('')
  const [qualityScore, setQualityScore] = useState(0)
  
  const { messages, isLoading, append } = useChat({
    api: '/api/writer/generate',
    onFinish: (message) => {
      // Save generated spec
      saveSpec(message.content)
    },
  })
  
  // Start generation on mount
  useEffect(() => {
    append({
      role: 'user',
      content: buildPrompt(params),
    })
  }, [])
  
  // Update quality score as content streams in
  useEffect(() => {
    if (messages.length > 0) {
      const content = messages[messages.length - 1]?.content || ''
      setStreamingContent(content)
      setQualityScore(calculateQuality(content))
    }
  }, [messages])
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main preview */}
      <div className="lg:col-span-2">
        <div className="card sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Spec</h2>
            <GenerationProgress isLoading={isLoading} />
          </div>
          
          <div className="prose prose-invert max-w-none">
            <MarkdownPreview 
              content={streamingContent}
              streaming={isLoading}
            />
          </div>
          
          {/* Cursor indicator while streaming */}
          {isLoading && (
            <motion.div
              className="w-2 h-6 bg-cherry-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quality Score */}
        <QualityScore
          score={qualityScore}
          streaming={isLoading}
        />
        
        {/* Actions (shown after generation) */}
        {!isLoading && streamingContent && (
          <motion.div
            className="card space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold">Actions</h3>
            
            <button 
              onClick={() => downloadSpec(streamingContent)}
              className="btn-primary w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Spec
            </button>
            
            <button
              onClick={() => saveToCollection(streamingContent)}
              className="btn-secondary w-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              Save to Collection
            </button>
          </motion.div>
        )}
        
        {/* Refinement options */}
        {!isLoading && streamingContent && (
          <RefinementPanel
            content={streamingContent}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </div>
  )
}

// Server Action for generation
// app/api/writer/generate/route.ts
import { DeepSeekStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      stream: true,
      temperature: 0.7,
    }),
  })
  
  const stream = DeepSeekStream(response)
  return new StreamingTextResponse(stream)
}
```

## Example: Accessibility Implementation

### From Spec (docs/specs/01-DESIGN-SYSTEM.md)

```
All components must:
- Be keyboard navigable
- Have proper ARIA labels
- Show focus indicators
- Support screen readers
- Respect reduced motion
```

### Implementation

```tsx
// components/ui/button.tsx
'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props 
  }, ref) => {
    // Respect user's motion preference
    const prefersReducedMotion = usePrefersReducedMotion()
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-cherry-500 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-dark-950',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          variant === 'primary' && [
            'bg-cherry-500 hover:bg-cherry-600 text-white',
            'shadow-lg shadow-cherry-500/30 hover:shadow-cherry-500/50',
          ],
          variant === 'secondary' && [
            'bg-dark-700 hover:bg-dark-600 text-white',
          ],
          variant === 'ghost' && [
            'hover:bg-dark-800 text-gray-100',
          ],
          
          // Sizes
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',
          
          className
        )}
        disabled={disabled || loading}
        // Accessibility
        aria-busy={loading}
        aria-disabled={disabled || loading}
        // Animation (respects prefers-reduced-motion)
        {...(!prefersReducedMotion && {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        })}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

// Hook to check user's motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  
  return prefersReducedMotion
}
```

## Key Patterns

### 1. Optimistic Updates
```tsx
// Immediate UI update, then sync with server
const handleUpvote = async (specId: string) => {
  // Optimistic update
  setSpecs(specs.map(s => 
    s.id === specId 
      ? { ...s, upvote_count: s.upvote_count + 1, has_upvoted: true }
      : s
  ))
  
  try {
    // Server update
    await upvoteSpec(specId)
  } catch (error) {
    // Rollback on error
    setSpecs(specs.map(s =>
      s.id === specId
        ? { ...s, upvote_count: s.upvote_count - 1, has_upvoted: false }
        : s
    ))
    toast.error('Failed to upvote')
  }
}
```

### 2. Streaming Responses
```tsx
// Handle streaming AI generation
const { messages, isLoading } = useChat({
  api: '/api/generate',
  onFinish: (message) => {
    // Generation complete
    saveSpec(message.content)
  },
})

// Display streaming content with cursor
<div className="prose">
  {messages.map(m => (
    <div key={m.id}>{m.content}</div>
  ))}
  {isLoading && <BlinkingCursor />}
</div>
```

### 3. Real-Time Updates
```tsx
// Subscribe to database changes
useEffect(() => {
  const channel = supabase
    .channel('specs')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'specs',
    }, (payload) => {
      // Add new spec to list
      setSpecs(prev => [payload.new, ...prev])
      toast.success('New spec published!')
    })
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [])
```

## Testing Examples

### Component Testing
```tsx
// __tests__/SpecCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SpecCard } from '@/components/SpecCard'

describe('SpecCard', () => {
  const mockSpec = {
    id: '1',
    title: 'Test Spec',
    description: 'Test description',
    // ... other fields
  }
  
  it('renders spec information', () => {
    render(<SpecCard spec={mockSpec} />)
    
    expect(screen.getByText('Test Spec')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
  
  it('handles upvote click', async () => {
    const onUpvote = jest.fn()
    render(<SpecCard spec={mockSpec} onUpvote={onUpvote} />)
    
    const upvoteButton = screen.getByRole('button', { name: /upvote/i })
    fireEvent.click(upvoteButton)
    
    expect(onUpvote).toHaveBeenCalledWith('1')
  })
  
  it('is keyboard accessible', () => {
    render(<SpecCard spec={mockSpec} />)
    
    const card = screen.getByRole('article')
    card.focus()
    
    expect(card).toHaveFocus()
  })
})
```

## Summary

These examples show how the detailed specifications translate into:

1. **React Components** - Following design system patterns
2. **API Endpoints** - Implementing streaming and real-time features
3. **State Management** - Optimistic updates and cache management
4. **Accessibility** - Keyboard nav, ARIA labels, reduced motion
5. **Testing** - Component and integration tests

Use the specs as your source of truth, and refer to these examples when implementing specific patterns.

---

**Made with 🍒 by following the specs exactly**
