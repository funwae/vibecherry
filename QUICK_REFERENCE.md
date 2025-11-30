# Quick Reference Guide

> **Common patterns and code snippets for rapid development**

## Color Classes

```css
/* Backgrounds */
.bg-dark-950    /* Page background */
.bg-dark-900    /* Card background */
.bg-dark-800    /* Nested card */
.bg-dark-700    /* Input backgrounds */

/* Cherry Accent */
.bg-cherry-500       /* Primary cherry */
.text-cherry-400     /* Cherry text */
.border-cherry-500   /* Cherry border */

/* Glassmorphism */
.glass              /* Frosted glass effect */
.glass-cherry       /* Cherry tinted glass */
```

## Typography

```tsx
{/* Headings */}
<h1 className="text-5xl md:text-7xl font-black">Hero</h1>
<h2 className="text-4xl md:text-5xl font-bold">Section</h2>
<h3 className="text-3xl md:text-4xl font-bold">Subsection</h3>

{/* Gradient text */}
<span className="text-gradient">Cherry Text</span>

{/* Code */}
<code className="font-mono text-sm bg-dark-800 px-1.5 py-0.5 rounded">
  code
</code>
```

## Buttons

```tsx
{/* Primary */}
<button className="btn-primary">
  <Sparkles className="w-4 h-4 mr-2" />
  Primary Action
</button>

{/* Secondary */}
<button className="btn-secondary">
  Secondary
</button>

{/* Ghost */}
<button className="btn-ghost">
  Ghost
</button>

{/* With loading state */}
<Button loading={isLoading}>
  Submit
</Button>
```

## Cards

```tsx
{/* Basic card */}
<div className="card">
  <h3 className="text-xl font-semibold mb-2">Title</h3>
  <p className="text-gray-400">Content</p>
</div>

{/* Glass card */}
<div className="glass rounded-xl p-6">
  Content
</div>

{/* Interactive card */}
<div className="card hover:border-cherry-500/50 transition-all cursor-pointer hover:-translate-y-1">
  Clickable content
</div>
```

## Inputs

```tsx
{/* Text input */}
<input
  type="text"
  className="input"
  placeholder="Enter text..."
/>

{/* Textarea */}
<textarea
  className="input resize-none"
  rows={4}
  placeholder="Enter description..."
/>

{/* With label */}
<div>
  <label className="block text-sm font-medium mb-2">
    Email
  </label>
  <input
    type="email"
    className="input"
    placeholder="you@example.com"
  />
</div>
```

## Animations

```tsx
{/* Fade in up */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

{/* Hover grow */}
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>

{/* Stagger children */}
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Toasts

```tsx
import { toast } from 'sonner'

{/* Success */}
toast.success('Action completed!')

{/* Error */}
toast.error('Something went wrong')

{/* With action */}
toast.success('Spec created!', {
  description: 'Your spec is ready',
  action: {
    label: 'View',
    onClick: () => router.push(`/specs/${id}`)
  }
})

{/* Custom */}
toast.custom((t) => (
  <div className="glass-cherry rounded-xl p-4">
    <div className="flex items-start gap-3">
      <Cherry className="w-6 h-6 text-cherry-400" />
      <div>
        <h3 className="font-semibold">Achievement!</h3>
        <p className="text-sm text-gray-400">First spec created</p>
      </div>
    </div>
  </div>
))
```

## Loading States

```tsx
{/* Skeleton */}
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-dark-700 rounded w-3/4" />
  <div className="h-4 bg-dark-700 rounded w-1/2" />
</div>

{/* Spinner */}
<motion.div
  className="w-8 h-8 border-4 border-dark-600 border-t-cherry-500 rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
/>

{/* Progress bar */}
<div className="h-2 bg-dark-700 rounded-full overflow-hidden">
  <motion.div
    className="h-full bg-cherry-500"
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.3 }}
  />
</div>
```

## Data Fetching

```tsx
{/* SWR */}
import useSWR from 'swr'

const { data, error, isLoading } = useSWR('/api/specs', fetcher)

{/* React Query */}
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['specs', filters],
  queryFn: () => fetchSpecs(filters)
})

{/* Infinite scroll */}
const { 
  data, 
  fetchNextPage, 
  hasNextPage 
} = useInfiniteQuery({
  queryKey: ['specs'],
  queryFn: ({ pageParam = 0 }) => fetchSpecs(pageParam),
  getNextPageParam: (lastPage, pages) =>
    lastPage.length === 20 ? pages.length * 20 : undefined
})
```

## Real-Time

```tsx
{/* Subscribe to changes */}
useEffect(() => {
  const channel = supabase
    .channel('public-specs')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'specs'
    }, (payload) => {
      // Handle new spec
      addSpec(payload.new)
    })
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [])

{/* Presence (who's online) */}
const channel = supabase.channel('room')
  .on('presence', { event: 'sync' }, () => {
    const users = channel.presenceState()
    setOnlineUsers(users)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: user.id,
        online_at: new Date().toISOString()
      })
    }
  })
```

## Server Actions

```tsx
// app/actions/specs.ts
'use server'

export async function createSpec(formData: FormData) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('specs')
    .insert({
      title: formData.get('title'),
      content: formData.get('content'),
      // ...
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/feed')
  return data
}

// In component
const handleSubmit = async (formData: FormData) => {
  const spec = await createSpec(formData)
  toast.success('Spec created!')
  router.push(`/specs/${spec.id}`)
}
```

## Keyboard Shortcuts

```tsx
import { useHotkeys } from 'react-hotkeys-hook'

{/* Single shortcut */}
useHotkeys('cmd+k', () => {
  openCommandPalette()
})

{/* Multiple shortcuts */}
useHotkeys('cmd+s', () => save(), { preventDefault: true })
useHotkeys('cmd+enter', () => submit())
useHotkeys('esc', () => close())

{/* Scoped shortcuts */}
useHotkeys('j', () => selectNext(), {
  scopes: ['feed']
})
```

## Accessibility

```tsx
{/* Focus trap in modal */}
import { FocusTrap } from '@/components/FocusTrap'

<FocusTrap>
  <div role="dialog" aria-modal="true">
    {/* Modal content */}
  </div>
</FocusTrap>

{/* Screen reader only */}
<span className="sr-only">
  Accessible description
</span>

{/* ARIA labels */}
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

{/* Live region for dynamic content */}
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

## Form Validation

```tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1).max(10),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})

const onSubmit = (data) => {
  // Data is validated
  createSpec(data)
}

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('title')} />
    {errors.title && (
      <span className="text-red-400 text-sm">
        {errors.title.message}
      </span>
    )}
  </form>
)
```

## Image Optimization

```tsx
import Image from 'next/image'

{/* Lazy loaded image */}
<Image
  src={spec.screenshot_url}
  alt={spec.title}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL={spec.blur_hash}
/>

{/* Fill container */}
<div className="relative aspect-video">
  <Image
    src={url}
    alt="Description"
    fill
    className="object-cover"
  />
</div>
```

## Responsive Design

```tsx
{/* Mobile first */}
<div className="
  grid 
  grid-cols-1       /* Mobile: 1 column */
  md:grid-cols-2    /* Tablet: 2 columns */
  lg:grid-cols-3    /* Desktop: 3 columns */
  gap-4
">
  {items}
</div>

{/* Hide on mobile */}
<div className="hidden md:block">
  Desktop only
</div>

{/* Show on mobile only */}
<div className="md:hidden">
  Mobile only
</div>
```

## Error Handling

```tsx
{/* Error boundary */}
'use client'

export function ErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error
  reset: () => void 
}) {
  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-400 mb-6">
        {error.message}
      </p>
      <button onClick={reset} className="btn-primary">
        Try Again
      </button>
    </div>
  )
}

{/* Try-catch in server action */}
'use server'

export async function action() {
  try {
    // Do something
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: 'Validation failed' }
    }
    throw error
  }
}
```

## Performance

```tsx
{/* Lazy load component */}
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <LoadingSpinner /> }
)

{/* Debounce search */}
import { useDebouncedCallback } from 'use-debounce'

const debouncedSearch = useDebouncedCallback(
  (query) => performSearch(query),
  300
)

{/* Virtual scrolling */}
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  )}
</FixedSizeList>
```

---

**Bookmark this for quick reference while building!** 🍒
