# System Architecture Overview

## High-Level Architecture

VibeCherry is built as a modern, edge-first web application optimized for performance, scalability, and developer experience.

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                    (Web, Mobile, API)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │   Vercel Edge Network   │
        │   (CDN + Edge Functions)│
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │   Next.js 14 App Router │
        │   (React Server Components)
        │   - Server Actions       │
        │   - Streaming RSC        │
        │   - Route Handlers       │
        └────────┬────────┬────────┘
                 │        │
        ┌────────┴────┐  │
        │  Supabase   │  │
        │  - Postgres │  │
        │  - Auth     │  │
        │  - Storage  │  │
        │  - Realtime │  │
        └─────────────┘  │
                         │
        ┌────────────────┴────────────┐
        │    External Services         │
        │  - DeepSeek (AI)            │
        │  - OpenAI (Embeddings)      │
        │  - Upstash (Redis/Cache)    │
        │  - Replicate (Images)       │
        └─────────────────────────────┘
```

## Core Principles

### 1. Edge-First Architecture
- **Static Generation**: Pre-render everything possible
- **ISR (Incremental Static Regeneration)**: Update static content on-demand
- **Edge Functions**: Run logic close to users
- **Edge Caching**: Cache at CDN layer with Upstash

### 2. React Server Components
- **Server-First**: Default to RSC for data fetching
- **Client Components**: Only when needed for interactivity
- **Streaming**: Progressive page rendering
- **Suspense**: Granular loading states

### 3. Progressive Enhancement
- **SSR Baseline**: Works without JavaScript
- **Enhanced with JS**: Better UX with client-side features
- **WebGL Optional**: 3D features degrade gracefully
- **Service Worker**: Offline support (optional)

### 4. Real-Time by Default
- **Supabase Realtime**: Live updates for social features
- **Optimistic Updates**: Instant UI feedback
- **Presence**: See who's online
- **Live Cursors**: Collaborative editing (future)

## Data Flow Patterns

### Read Path (Optimized)
```
User Request
    ↓
Edge Cache (Upstash) ──┬─→ Cache Hit → Return
    ↓                   └─→ Cache Miss ↓
Server Component
    ↓
Supabase (RLS + Indexes)
    ↓
Transform & Stream
    ↓
Cache & Return
```

### Write Path (Optimistic)
```
User Action
    ↓
Client: Optimistic Update (instant UI)
    ↓
Server Action (Next.js)
    ↓
Database Write (Supabase)
    ↓
Revalidate Cache
    ↓
Broadcast Change (Realtime)
    ↓
Update All Connected Clients
```

### AI Generation Path (Streaming)
```
User Input → Validate
    ↓
Queue Job (Upstash)
    ↓
DeepSeek API (Stream)
    ↓
Stream to Client (SSE)
    ↓
Save to Database
    ↓
Generate Screenshot (Background)
    ↓
Update with Screenshot URL
```

## Technology Decisions

### Why Next.js 14?
- **App Router**: True server components, better DX
- **Server Actions**: Type-safe mutations, no API routes needed
- **Streaming**: Progressive rendering, better perceived performance
- **Built-in Optimization**: Images, fonts, scripts auto-optimized
- **Vercel Integration**: Best deployment experience

### Why Supabase?
- **Postgres**: Powerful, proven, excellent for complex queries
- **RLS**: Row-level security built-in, secure by default
- **Realtime**: WebSocket subscriptions out of the box
- **Storage**: S3-compatible, great for screenshots
- **Auth**: JWT-based, plays nice with Next.js middleware
- **Migrations**: SQL-first, version controlled

### Why DeepSeek?
- **Cost**: More affordable than GPT-4 for generation
- **Speed**: Fast response times for streaming
- **Quality**: Excellent code/spec generation
- **API Compatibility**: OpenAI-like interface

### Why Upstash?
- **Edge Redis**: Redis at every edge location
- **Serverless**: Pay per request, auto-scaling
- **Low Latency**: Sub-10ms responses globally
- **Rate Limiting**: Built-in rate limiting
- **Caching**: Perfect for expensive operations

## Database Architecture

### Schema Design Philosophy
1. **Normalized**: Proper relationships, minimal redundancy
2. **Indexed**: Query performance matters
3. **RLS-First**: Security via policies, not app logic
4. **Full-Text Search**: Built-in Postgres FTS
5. **Computed Columns**: Use generated columns for derived data
6. **JSONB**: Flexible metadata storage where needed

### Key Tables
```
profiles (extends auth.users)
├── User identity
├── Acidentiton data
├── Usage metrics
└── Preferences

specs
├── Content (MD/JSON)
├── Metadata (category, tags, vibe)
├── Engagement (upvotes, downloads)
├── Search vector (FTS)
└── Screenshot data

collections
├── User collections
├── Public/private toggle
└── Spec associations (many-to-many)

upvotes
└── User <-> Spec relationship

comments (new, enhanced)
├── Threaded discussions
├── Reactions
└── Mentions

notifications (new, enhanced)
├── Real-time alerts
├── Preferences
└── Read status

achievements (new, enhanced)
├── Gamification
├── Progress tracking
└── Unlock conditions
```

### Indexes Strategy
```sql
-- High-traffic queries
CREATE INDEX specs_public_featured ON specs (is_public, is_featured);
CREATE INDEX specs_category_upvotes ON specs (category, upvote_count DESC);
CREATE INDEX specs_created_at ON specs (created_at DESC);

-- Full-text search
CREATE INDEX specs_search_gin ON specs USING GIN (search_vector);

-- Relationships
CREATE INDEX upvotes_spec ON upvotes (spec_id);
CREATE INDEX upvotes_user ON upvotes (user_id);
CREATE INDEX comments_spec ON comments (spec_id, created_at DESC);

-- Analytics (future)
CREATE INDEX analytics_date ON analytics (date, event_type);
```

## Caching Strategy

### Layers of Cache

1. **Browser Cache** (Static Assets)
   - `Cache-Control: public, max-age=31536000, immutable`
   - JS, CSS, images, fonts

2. **CDN Cache** (Edge)
   - `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
   - Generated pages, API responses

3. **Edge KV** (Upstash)
   - User sessions
   - Rate limiting data
   - Expensive query results
   - TTL: 5 minutes to 1 hour

4. **Database Cache** (Supabase)
   - Connection pooling
   - Prepared statement cache
   - Query result cache (pg_stat_statements)

### Cache Invalidation
```typescript
// Revalidate on write
export async function createSpec(data) {
  const spec = await db.specs.create(data)

  // Revalidate affected paths
  revalidatePath('/feed')
  revalidatePath(`/specs/${spec.id}`)
  revalidateTag(`user-${spec.created_by}`)

  // Clear edge cache
  await clearEdgeCache(['feed', `spec-${spec.id}`])

  return spec
}
```

## Real-Time Architecture

### Supabase Realtime Channels
```typescript
// Subscribe to changes
const channel = supabase
  .channel('public:specs')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'specs',
    filter: 'is_public=eq.true'
  }, payload => {
    // Update UI optimistically
    updateSpecsInCache(payload.new)
  })
  .subscribe()
```

### Presence (Who's Online)
```typescript
// Track active users
channel
  .on('presence', { event: 'sync' }, () => {
    const users = channel.presenceState()
    displayActiveUsers(users)
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    showJoinNotification(newPresences)
  })
  .subscribe()
```

## AI Integration Architecture

### Streaming Generation
```typescript
// Server Action with streaming
export async function generateSpec(input: string) {
  const stream = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: input }],
    stream: true
  })

  // Stream to client
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    }
  })
}
```

### Embeddings for Search
```typescript
// Generate embeddings for semantic search
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: spec.content
})

// Store in database
await db.specs.update({
  where: { id: spec.id },
  data: { embedding: embedding.data[0].embedding }
})

// Search by similarity
const similar = await db.$queryRaw`
  SELECT id, title,
    1 - (embedding <=> ${targetEmbedding}::vector) as similarity
  FROM specs
  WHERE 1 - (embedding <=> ${targetEmbedding}::vector) > 0.8
  ORDER BY similarity DESC
  LIMIT 10
`
```

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms
- **TTFB (Time to First Byte)**: < 600ms

### Application Metrics
- **Time to Interactive**: < 3s on 3G
- **Bundle Size**: < 150KB (initial JS)
- **API Response**: < 200ms (p95)
- **Database Query**: < 50ms (p95)
- **AI Generation**: < 5s for 1000 tokens

## Security Architecture

### Defense in Depth

1. **Authentication** (Supabase Auth)
   - JWT tokens
   - Secure cookie storage
   - CSRF protection

2. **Authorization** (RLS Policies)
   - Row-level security
   - Fine-grained permissions
   - User can only modify own data

3. **Input Validation**
   - Zod schemas
   - Sanitization
   - Type safety

4. **Rate Limiting** (Upstash)
   - Per-user limits
   - Per-IP limits
   - Sliding window

5. **Content Security**
   - CSP headers
   - CORS configuration
   - XSS protection

### Example RLS Policy
```sql
-- Users can only update their own specs
CREATE POLICY "Users update own specs"
ON specs FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Public specs viewable by all
CREATE POLICY "Public specs viewable"
ON specs FOR SELECT
USING (is_public = true OR created_by = auth.uid());
```

## Monitoring & Observability

### Metrics Collection
- **Vercel Analytics**: Web Vitals, geographic distribution
- **Sentry**: Error tracking, performance monitoring
- **PostHog**: Product analytics, feature flags
- **Supabase**: Database performance, query analytics

### Logging Strategy
```typescript
// Structured logging
logger.info('spec.created', {
  userId: user.id,
  specId: spec.id,
  category: spec.category,
  duration: performance.now() - startTime
})

// Error tracking
logger.error('spec.generation.failed', {
  userId: user.id,
  error: error.message,
  stack: error.stack,
  context: { input, model }
})
```

### Alerting
- Database latency > 200ms
- Error rate > 1%
- AI generation failures > 5%
- Cache hit rate < 80%
- Concurrent users > capacity threshold

## Scalability Considerations

### Current Scale (MVP)
- **Users**: 1K - 10K
- **Specs**: 10K - 100K
- **Requests**: 1M/month
- **Database**: Single Postgres instance
- **Costs**: ~$50-100/month

### Future Scale (Growth)
- **Users**: 100K - 1M
- **Specs**: 1M - 10M
- **Requests**: 100M/month
- **Database**: Connection pooling, read replicas
- **Costs**: ~$500-1K/month

### Scaling Strategies
1. **Database**: Read replicas, connection pooling
2. **Caching**: Aggressive edge caching
3. **CDN**: Global distribution
4. **AI**: Rate limiting, queuing system
5. **Storage**: CDN for screenshots

## Deployment Architecture

### Vercel (Recommended)
```
Production: main branch → vercel.com
Preview: PRs → preview-{hash}.vercel.app
Development: Local → localhost:3000
```

### Environment Variables
```env
# Different per environment
DATABASE_URL              # Production DB
NEXT_PUBLIC_SUPABASE_URL  # Supabase project
DEEPSEEK_API_KEY          # AI generation
UPSTASH_REDIS_URL         # Edge cache
```

### CI/CD Pipeline
1. **Lint**: ESLint, Prettier
2. **Type Check**: TypeScript strict mode
3. **Test**: Unit tests (Vitest), E2E (Playwright)
4. **Build**: Next.js production build
5. **Deploy**: Vercel automatic deployment
6. **Verify**: Smoke tests post-deployment

## Cost Optimization

### Current Stack Costs (Estimated)
- **Vercel**: $20/month (Pro tier)
- **Supabase**: $25/month (Pro tier)
- **Upstash**: $10/month (Redis)
- **DeepSeek**: Usage-based (~$10-50/month)
- **OpenAI**: Embeddings (~$5-20/month)
- **Total**: ~$70-125/month

### Optimization Strategies
- **Caching**: Reduce database queries by 80%
- **ISR**: Generate pages on-demand, not build-time
- **Edge Functions**: Reduce origin requests
- **Lazy Loading**: Load images, components on-demand
- **Code Splitting**: Ship less JavaScript

## Future Enhancements

### Phase 2 (Q2 2025)
- **Search**: Semantic search with embeddings
- **Collaboration**: Real-time co-editing
- **Mobile Apps**: React Native apps
- **Public API**: REST + GraphQL endpoints

### Phase 3 (Q3 2025)
- **Teams**: Organization accounts
- **Analytics**: Usage dashboards
- **Marketplace**: Paid premium specs
- **Integrations**: Figma, VS Code, Notion

### Phase 4 (Q4 2025)
- **AI Agents**: Auto-improve specs
- **Version Control**: Git-like spec versioning
- **Custom AI**: Fine-tuned models
- **White Label**: Self-hosted enterprise

---

**Next**: Review `DATABASE.md` for detailed schema design
