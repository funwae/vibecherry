# Feed & Browse - Advanced Spec Discovery

> **"Finding the perfect spec should feel like magic."**

## Overview

The Feed is where users discover, filter, and explore the spec library. It combines powerful search with delightful browsing, making it easy to find exactly what you need or stumble upon something inspiring.

## User Stories

```
As a developer,
I want to quickly find specs similar to what I'm building,
So that I don't start from scratch

As a creative,
I want to browse by vibe and aesthetic,
So that I find specs that match my visual direction

As a power user,
I want to combine filters and save searches,
So that I can quickly revisit relevant specs
```

## Layout Architecture

### Three View Modes

1. **Grid View** (Default)
   - Card-based layout
   - Screenshot previews
   - Quick actions on hover
   - Best for browsing

2. **List View**
   - Compact rows
   - More metadata visible
   - Faster scanning
   - Best for power users

3. **Masonry View**
   - Pinterest-style layout
   - Variable heights
   - Visual emphasis
   - Best for inspiration

```tsx
<Feed>
  <FeedHeader>
    <SearchBar />
    <FilterButton />
    <ViewToggle />
    <SortDropdown />
  </FeedHeader>

  <FeedSidebar>
    <FilterPanel />
    <SavedSearches />
  </FeedSidebar>

  <FeedMain>
    <SpecGrid /> {/* or SpecList or SpecMasonry */}
  </FeedMain>
</Feed>
```

## Search System

### Multi-Modal Search

```tsx
<SearchBar
  placeholder="Search specs, tags, or paste a URL..."
  value={query}
  onChange={handleSearch}
  onSubmit={handleSubmit}
>
  {/* Search modes */}
  <SearchModes>
    <Mode active={mode === 'text'}>
      <Search className="w-4 h-4" />
      Text
    </Mode>
    <Mode active={mode === 'semantic'}>
      <Sparkles className="w-4 h-4" />
      AI Search
    </Mode>
    <Mode active={mode === 'visual'}>
      <Image className="w-4 h-4" />
      Visual
    </Mode>
  </SearchModes>

  {/* Search suggestions */}
  {query.length > 0 && (
    <SearchSuggestions>
      <RecentSearches searches={recentSearches} />
      <PopularSearches searches={popularSearches} />
      <SmartSuggestions suggestions={aiSuggestions} />
    </SearchSuggestions>
  )}
</SearchBar>
```

### Search Implementation

```typescript
// Text search (fast, synchronous)
const textSearch = (query: string) => {
  return db.specs
    .where('search_vector', '@@', toTsQuery(query))
    .orderByRank()
}

// Semantic search (AI-powered, slower but smarter)
const semanticSearch = async (query: string) => {
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query)

  // Vector similarity search
  const results = await db.$queryRaw`
    SELECT *,
      1 - (embedding <=> ${queryEmbedding}::vector) as similarity
    FROM specs
    WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.7
    ORDER BY similarity DESC
    LIMIT 20
  `

  return results
}

// Visual search (upload reference image)
const visualSearch = async (imageFile: File) => {
  // Extract visual features
  const features = await extractImageFeatures(imageFile)

  // Find specs with similar screenshots
  return findSimilarByVisualFeatures(features)
}
```

### Search Intelligence

```typescript
// Auto-correct typos
const correctedQuery = await spellCheck(query)
if (correctedQuery !== query) {
  showSuggestion(`Did you mean: ${correctedQuery}?`)
}

// Expand abbreviations
const expandedQuery = expandAbbreviations(query) // "ML" → "machine learning"

// Suggest related terms
const relatedTerms = await getRelatedTerms(query)
// "react" → ["nextjs", "typescript", "tailwind"]
```

## Filter System

### Filter Panel

```tsx
<FilterPanel>
  {/* Quick filters (chips) */}
  <QuickFilters>
    <FilterChip
      active={filters.featured}
      onClick={() => toggleFilter('featured')}
    >
      ⭐ Featured
    </FilterChip>
    <FilterChip
      active={filters.new}
      onClick={() => toggleFilter('new')}
    >
      🆕 New This Week
    </FilterChip>
    <FilterChip
      active={filters.trending}
      onClick={() => toggleFilter('trending')}
    >
      🔥 Trending
    </FilterChip>
  </QuickFilters>

  {/* Category filter */}
  <FilterSection title="Category">
    <CategorySelect
      options={CATEGORIES}
      selected={filters.categories}
      onChange={updateCategories}
      showCount // Show spec count per category
    />
  </FilterSection>

  {/* Difficulty filter */}
  <FilterSection title="Difficulty">
    <DifficultyButtons
      options={DIFFICULTIES}
      selected={filters.difficulty}
      onChange={updateDifficulty}
    />
  </FilterSection>

  {/* Vibe filter */}
  <FilterSection title="Vibe">
    <VibeGrid
      vibes={VIBES}
      selected={filters.vibes}
      onChange={updateVibes}
      multiple
    />
  </FilterSection>

  {/* Tags filter */}
  <FilterSection title="Tags">
    <TagCloud
      tags={popularTags}
      selected={filters.tags}
      onChange={updateTags}
    />
    <TagSearch
      placeholder="Search tags..."
      onSelect={addTag}
    />
  </FilterSection>

  {/* Advanced filters (collapsed) */}
  <Collapsible title="Advanced">
    <FilterSection title="Upvotes">
      <RangeSlider
        min={0}
        max={1000}
        value={filters.upvoteRange}
        onChange={updateUpvoteRange}
      />
    </FilterSection>

    <FilterSection title="Downloads">
      <RangeSlider
        min={0}
        max={10000}
        value={filters.downloadRange}
        onChange={updateDownloadRange}
      />
    </FilterSection>

    <FilterSection title="Created">
      <DateRangePicker
        value={filters.dateRange}
        onChange={updateDateRange}
        presets={['Last Week', 'Last Month', 'Last Year']}
      />
    </FilterSection>
  </Collapsible>

  {/* Actions */}
  <FilterActions>
    <SaveSearch filters={filters} />
    <ClearFilters onClick={resetFilters} />
  </FilterActions>
</FilterPanel>
```

### Smart Filtering

```typescript
// Combine filters intelligently
const applyFilters = (specs: Spec[], filters: Filters) => {
  let filtered = specs

  // Category (exact match)
  if (filters.categories.length > 0) {
    filtered = filtered.filter(s =>
      filters.categories.includes(s.category)
    )
  }

  // Difficulty (multi-select)
  if (filters.difficulty.length > 0) {
    filtered = filtered.filter(s =>
      filters.difficulty.includes(s.difficulty)
    )
  }

  // Tags (AND or OR based on user preference)
  if (filters.tags.length > 0) {
    filtered = filters.tagMode === 'AND'
      ? filtered.filter(s =>
          filters.tags.every(tag => s.tags.includes(tag))
        )
      : filtered.filter(s =>
          filters.tags.some(tag => s.tags.includes(tag))
        )
  }

  // Vibes (OR)
  if (filters.vibes.length > 0) {
    filtered = filtered.filter(s =>
      filters.vibes.includes(s.vibe)
    )
  }

  // Upvotes range
  filtered = filtered.filter(s =>
    s.upvote_count >= filters.upvoteRange[0] &&
    s.upvote_count <= filters.upvoteRange[1]
  )

  // Date range
  if (filters.dateRange) {
    filtered = filtered.filter(s =>
      isWithinInterval(new Date(s.created_at), filters.dateRange)
    )
  }

  return filtered
}

// Smart defaults based on context
if (user.recentCategory) {
  setDefaultFilter('category', user.recentCategory)
}

if (user.skillLevel === 'beginner') {
  setDefaultFilter('difficulty', ['weekend'])
}
```

## Sort Options

```typescript
const SORT_OPTIONS = [
  {
    value: 'relevant',
    label: 'Most Relevant',
    fn: (a, b) => b.relevanceScore - a.relevanceScore,
  },
  {
    value: 'popular',
    label: 'Most Popular',
    fn: (a, b) => b.upvote_count - a.upvote_count,
  },
  {
    value: 'recent',
    label: 'Newest First',
    fn: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  },
  {
    value: 'downloads',
    label: 'Most Downloaded',
    fn: (a, b) => b.download_count - a.download_count,
  },
  {
    value: 'quality',
    label: 'Highest Quality',
    fn: (a, b) => b.quality_score - a.quality_score,
  },
]
```

## Spec Card Design

### Grid View Card

```tsx
<SpecCard
  spec={spec}
  onClick={() => router.push(`/specs/${spec.id}`)}
  onUpvote={handleUpvote}
  onSave={handleSave}
>
  {/* Screenshot with lazy loading */}
  <CardImage>
    <Image
      src={spec.screenshot_url}
      alt={spec.title}
      fill
      className="object-cover"
      loading="lazy"
    />

    {/* Badges */}
    <BadgeGroup>
      {spec.is_featured && <Badge variant="featured">⭐ Featured</Badge>}
      {isNew(spec) && <Badge variant="new">New</Badge>}
      {isTrending(spec) && <Badge variant="trending">🔥</Badge>}
    </BadgeGroup>

    {/* Quick actions (show on hover) */}
    <QuickActions>
      <IconButton
        icon={<Eye />}
        label="Quick preview"
        onClick={handleQuickPreview}
      />
      <IconButton
        icon={<Download />}
        label="Download"
        onClick={handleDownload}
      />
    </QuickActions>
  </CardImage>

  {/* Content */}
  <CardContent>
    <CardHeader>
      <CardTitle>{spec.title}</CardTitle>
      <Difficulty level={spec.difficulty} />
    </CardHeader>

    <CardDescription>
      {truncate(spec.description, 100)}
    </CardDescription>

    <TagList tags={spec.tags.slice(0, 3)} />

    <CardMeta>
      <MetaItem>
        <Heart className={spec.has_upvoted ? 'fill-current text-cherry-500' : ''} />
        {formatNumber(spec.upvote_count)}
      </MetaItem>
      <MetaItem>
        <Download />
        {formatNumber(spec.download_count)}
      </MetaItem>
      <MetaItem>
        <Calendar />
        {formatDate(spec.created_at)}
      </MetaItem>
    </CardMeta>
  </CardContent>

  {/* Creator */}
  <CardFooter>
    <CreatorInfo
      username={spec.profile.username}
      avatar={<Acidentiton seed={spec.profile.acidentiton_seed} />}
      onClick={() => router.push(`/profile/${spec.profile.username}`)}
    />
  </CardFooter>
</SpecCard>
```

### Interaction States

```typescript
// Hover effect
const hoverVariants = {
  rest: {
    y: 0,
    boxShadow: '0 0 0 rgba(244, 63, 94, 0)',
  },
  hover: {
    y: -8,
    boxShadow: '0 10px 30px rgba(244, 63, 94, 0.2)',
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
}

// Upvote animation
const upvoteVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.9 },
  upvoted: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.3 }
  }
}
```

## Quick Preview Modal

```tsx
<QuickPreviewModal
  spec={spec}
  open={isPreviewOpen}
  onClose={closePreview}
>
  <PreviewHeader>
    <PreviewTitle>{spec.title}</PreviewTitle>
    <PreviewActions>
      <DownloadButton spec={spec} />
      <SaveButton spec={spec} />
      <ShareButton spec={spec} />
    </PreviewActions>
  </PreviewHeader>

  <PreviewTabs>
    <Tab label="Content">
      {spec.spec_type === 'markdown' ? (
        <MarkdownPreview content={spec.content} />
      ) : (
        <JSONPreview content={spec.content} />
      )}
    </Tab>

    <Tab label="Details">
      <SpecMetadata spec={spec} />
    </Tab>

    <Tab label="Similar">
      <SimilarSpecs spec={spec} />
    </Tab>
  </PreviewTabs>

  <PreviewFooter>
    <Button onClick={() => router.push(`/specs/${spec.id}`)}>
      View Full Details
    </Button>
  </PreviewFooter>
</QuickPreviewModal>
```

## Infinite Scroll & Pagination

```typescript
// Infinite scroll implementation
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ['specs', filters, sort],
    queryFn: ({ pageParam = 0 }) => fetchSpecs({
      filters,
      sort,
      limit: 20,
      offset: pageParam,
    }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length * 20 : undefined,
  })

// Intersection observer for auto-loading
const { ref, inView } = useInView({
  threshold: 0,
  rootMargin: '100px', // Start loading 100px before bottom
})

useEffect(() => {
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, [inView, hasNextPage, isFetchingNextPage])

// Render
<>
  <SpecGrid specs={data?.pages.flat()} />

  {/* Loading trigger */}
  <div ref={ref} className="h-20">
    {isFetchingNextPage && <LoadingSpinner />}
  </div>
</>
```

## Saved Searches

```tsx
<SavedSearches>
  {savedSearches.map(search => (
    <SavedSearch
      key={search.id}
      name={search.name}
      filters={search.filters}
      count={search.resultCount}
      onClick={() => loadSearch(search)}
      onDelete={() => deleteSearch(search.id)}
      onNotify={() => toggleNotifications(search.id)}
    >
      {/* Show unread count if notifications enabled */}
      {search.notifications_enabled && search.new_count > 0 && (
        <Badge>{search.new_count} new</Badge>
      )}
    </SavedSearch>
  ))}

  <SaveCurrentSearch
    filters={currentFilters}
    onSave={handleSaveSearch}
  />
</SavedSearches>
```

## Empty States

```tsx
{/* No results */}
{filteredSpecs.length === 0 && (
  <EmptyState
    icon={<Search className="w-16 h-16 text-gray-600" />}
    title="No specs found"
    description={
      hasFilters
        ? "Try adjusting your filters"
        : "Be the first to create one!"
    }
    actions={[
      {
        label: hasFilters ? "Clear Filters" : "Create Spec",
        onClick: hasFilters ? clearFilters : () => router.push('/writer'),
        variant: "primary",
      }
    ]}
  />
)}

{/* First time user */}
{isFirstVisit && specs.length > 0 && (
  <WelcomeBanner>
    <h3>Welcome to VibeCherry! 🍒</h3>
    <p>Browse specs, save your favorites, or create your own.</p>
    <TourButton onClick={startTour}>Take a Tour</TourButton>
  </WelcomeBanner>
)}
```

## Real-Time Updates

```typescript
// Subscribe to new specs
useEffect(() => {
  const channel = supabase
    .channel('public-specs')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'specs',
        filter: 'is_public=eq.true',
      },
      (payload) => {
        // Show toast for new spec
        toast.custom((t) => (
          <NewSpecToast
            spec={payload.new}
            onClick={() => {
              router.push(`/specs/${payload.new.id}`)
              toast.dismiss(t)
            }}
          />
        ))

        // Add to feed if matches filters
        if (matchesFilters(payload.new, filters)) {
          queryClient.setQueryData(['specs'], (old) => ({
            ...old,
            pages: [[payload.new], ...(old?.pages || [])]
          }))
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [filters])
```

## Performance Optimizations

### Virtual Scrolling
```typescript
// For very long lists, use react-window
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={3}
  columnWidth={350}
  height={window.innerHeight - 200}
  rowCount={Math.ceil(specs.length / 3)}
  rowHeight={400}
  width={window.innerWidth}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 3 + columnIndex
    const spec = specs[index]
    return spec ? (
      <div style={style}>
        <SpecCard spec={spec} />
      </div>
    ) : null
  }}
</FixedSizeGrid>
```

### Image Optimization
```typescript
// Lazy load screenshots
<Image
  src={spec.screenshot_url}
  alt={spec.title}
  loading="lazy"
  placeholder="blur"
  blurDataURL={spec.placeholder_blur}
/>

// Generate blurhash on upload
import { encode } from 'blurhash'

const blurhash = await generateBlurhash(imageBuffer)
await db.specs.update({
  where: { id },
  data: { placeholder_blur: blurhash }
})
```

### Debounced Search
```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query)
  }, 300),
  []
)
```

## Keyboard Shortcuts

- `/`: Focus search
- `⌘K`: Open command palette
- `G then F`: Go to feed (vim-style navigation)
- `J/K`: Navigate results
- `↵`: Open selected spec
- `L`: Upvote selected spec
- `S`: Save to collection
- `D`: Download
- `Esc`: Clear search/filters

## Analytics

```typescript
// Track search patterns
analytics.track('feed.searched', {
  query,
  mode: searchMode,
  results_count: results.length,
  filters_active: Object.keys(activeFilters).length,
})

// Track filter usage
analytics.track('feed.filtered', {
  filter_type: filterType,
  filter_value: filterValue,
  results_before: unfilteredCount,
  results_after: filteredCount,
})

// Track engagement
analytics.track('feed.spec_clicked', {
  spec_id: spec.id,
  position: index,
  view_mode: viewMode,
  from_search: fromSearch,
})
```

## Accessibility

- All filters keyboard accessible
- Screen reader announcements for result counts
- ARIA labels for all controls
- Focus management in modals
- High contrast support
- Reduced motion support

## Testing Checklist

- [ ] Search returns relevant results
- [ ] Filters combine correctly
- [ ] Infinite scroll doesn't skip/duplicate
- [ ] Real-time updates don't break pagination
- [ ] Saved searches persist correctly
- [ ] Quick preview loads spec content
- [ ] Empty states show appropriate messages
- [ ] Mobile touch gestures work
- [ ] Keyboard navigation is smooth
- [ ] Performance with 10,000+ specs

---

**Next**: See `05-PROFILE-SYSTEM.md` for user profiles and achievements
