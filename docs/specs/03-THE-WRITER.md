# The Writer - AI Spec Generator

> **"From idea to spec in seconds, from spec to app in minutes."**

## Overview

The Writer is VibeCherry's AI-powered specification generator. It transforms vague ideas into detailed, actionable MD/JSON specs through an intelligent, guided workflow.

### Core Innovation
- **Streaming Generation**: See specs being written in real-time
- **Smart Suggestions**: AI predicts what you need before you ask
- **Iterative Refinement**: Regenerate sections, not the whole spec
- **Quality Scoring**: Real-time feedback on spec completeness
- **Auto-Tagging**: Intelligent tag suggestions based on content

## User Stories

### Primary Flow
```
As a developer,
I want to describe my project idea,
So that I get a complete, actionable specification
```

### Enhanced Flows
```
As a power user,
I want to use keyboard shortcuts throughout,
So that I can create specs without touching my mouse

As a first-time user,
I want guided prompts and examples,
So that I know what to include in my input

As a returning user,
I want to reuse previous inputs,
So that I can iterate on similar projects quickly
```

## Multi-Step Flow

### Step 1: Idea Capture (The Spark)

**Purpose**: Get the core idea down quickly

**UI Components**:
```tsx
<StepOne>
  {/* Hero prompt */}
  <h1 className="text-gradient">
    What are you building? ✨
  </h1>

  {/* Smart textarea */}
  <Textarea
    placeholder="Describe your idea in a few sentences..."
    value={idea}
    onChange={handleIdeaChange}
    autoFocus
    minRows={3}
    maxRows={8}
    onKeyDown={handleKeyboard} // ⌘↵ to continue
  />

  {/* AI-powered suggestions */}
  <SmartSuggestions
    suggestions={aiSuggestions}
    onSelect={handleSuggestionSelect}
  />

  {/* Example prompts (collapsed by default) */}
  <ExamplePrompts
    examples={[
      "A SaaS dashboard for tracking team productivity with analytics",
      "An e-commerce site for sustainable fashion with AR try-on",
      "A portfolio site for a 3D artist with WebGL showcase",
    ]}
    onSelect={setIdea}
  />
</StepOne>
```

**Smart Features**:
1. **Auto-Save**: Every 3 seconds to localStorage
2. **Character Counter**: Show word count, not character count
3. **Suggestion Engine**:
   ```typescript
   // Detect intent from input
   if (idea.includes('dashboard')) {
     suggestCategory('saas-dashboard')
     suggestFeatures(['analytics', 'user-management'])
   }
   ```

**Keyboard Shortcuts**:
- `⌘↵`: Continue to next step
- `⌘⇧E`: Show examples
- `⌘⇧S`: Save draft
- `Esc`: Clear input

---

### Step 2: Project Structure

**Purpose**: Define pages, features, and tech stack

**UI Components**:
```tsx
<StepTwo>
  {/* Category selection */}
  <CategoryGrid
    categories={CATEGORIES}
    selected={category}
    onChange={setCategory}
    aiSuggestion={aiRecommendedCategory}
  />

  {/* Pages builder */}
  <PagesBuilder
    pages={pages}
    onChange={setPages}
    suggestions={commonPagesForCategory[category]}
  >
    <DragDropList
      items={pages}
      onReorder={setPages}
      renderItem={(page) => (
        <PageItem
          name={page}
          onEdit={editPage}
          onRemove={removePage}
        />
      )}
    />
    <AddPageInput
      onAdd={addPage}
      suggestions={pageSuggestions}
    />
  </PagesBuilder>

  {/* Features checklist */}
  <FeaturesSection>
    <SmartCheckboxGroup
      options={commonFeatures[category]}
      selected={features}
      onChange={setFeatures}
      aiRecommended={aiRecommendedFeatures}
    />
    <CustomFeatureInput
      onAdd={addCustomFeature}
    />
  </FeaturesSection>
</StepTwo>
```

**Smart Features**:
1. **Category Auto-Detection**:
   ```typescript
   // Analyze idea text to suggest category
   const suggestCategory = (idea: string) => {
     const keywords = extractKeywords(idea)
     const scores = CATEGORIES.map(cat =>
       calculateRelevanceScore(keywords, cat.keywords)
     )
     return CATEGORIES[argmax(scores)]
   }
   ```

2. **Common Pages by Category**:
   ```typescript
   const commonPages = {
     'saas-dashboard': ['Dashboard', 'Analytics', 'Settings', 'Team'],
     'e-commerce': ['Home', 'Shop', 'Product', 'Cart', 'Checkout'],
     'portfolio': ['Home', 'Work', 'About', 'Contact'],
   }
   ```

3. **Feature Recommendations**:
   ```typescript
   // Based on category + pages
   if (category === 'saas-dashboard' && pages.includes('Analytics')) {
     recommendFeatures([
       'Real-time metrics',
       'Custom date ranges',
       'Export to CSV',
       'Chart customization'
     ])
   }
   ```

**Interactions**:
- Drag & drop to reorder pages
- Click category for instant preview of common patterns
- Hover page to see recommended features
- Quick-add from suggestions with `↵`

---

### Step 3: Style & Vibe

**Purpose**: Define visual direction and tone

**UI Components**:
```tsx
<StepThree>
  {/* Vibe selector */}
  <VibeGrid
    vibes={VIBES}
    selected={vibe}
    onChange={setVibe}
  >
    {VIBES.map(vibe => (
      <VibeCard
        key={vibe.id}
        vibe={vibe}
        preview={<VibePreview vibe={vibe} />}
        selected={vibe.id === selectedVibe}
      />
    ))}
  </VibeGrid>

  {/* Color inspiration */}
  <ColorPalette
    colors={suggestedColors[vibe]}
    editable
    onChange={setColors}
  />

  {/* Design references (optional) */}
  <ReferenceUpload
    onUpload={handleReferenceUpload}
    maxFiles={3}
  >
    Drop screenshots or URLs for visual reference
  </ReferenceUpload>

  {/* Tone slider */}
  <ToneSelector
    value={tone}
    onChange={setTone}
    scale={['Professional', 'Balanced', 'Playful']}
  />
</StepThree>
```

**Vibe Options**:
```typescript
const VIBES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, focused, lots of whitespace',
    preview: 'Helvetica, neutral colors, generous spacing',
    keywords: ['clean', 'simple', 'focused'],
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun, colorful, personality-driven',
    preview: 'Rounded corners, vibrant colors, micro-interactions',
    keywords: ['fun', 'vibrant', 'engaging'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional, trustworthy, enterprise-ready',
    preview: 'Sans-serif, blues/grays, structured layout',
    keywords: ['professional', 'trustworthy', 'formal'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Cutting-edge, glassmorphism, gradients',
    preview: 'Frosted glass, bold gradients, 3D elements',
    keywords: ['contemporary', 'trendy', 'bold'],
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Nostalgic, pixel art, vintage aesthetics',
    preview: 'Pixel fonts, warm colors, chunky borders',
    keywords: ['vintage', 'nostalgic', '90s'],
  },
]
```

**Color Intelligence**:
```typescript
// Extract colors from reference images
const extractDominantColors = async (image: File) => {
  const colorThief = new ColorThief()
  const colors = await colorThief.getPalette(image, 5)
  return colors.map(rgb => rgbToHex(rgb))
}

// Suggest palettes based on vibe
const suggestPalette = (vibe: string) => {
  const palettes = {
    minimal: ['#000000', '#FFFFFF', '#F5F5F5'],
    playful: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    corporate: ['#2C3E50', '#3498DB', '#ECF0F1'],
    modern: ['#FF006E', '#8338EC', '#3A86FF'],
    retro: ['#FF6B35', '#F7931E', '#FBB040'],
  }
  return palettes[vibe]
}
```

---

### Step 4: Generate & Refine

**Purpose**: AI generates spec with real-time streaming

**UI Components**:
```tsx
<StepFour>
  {/* Progress indicator */}
  <GenerationProgress
    stage={currentStage}
    stages={[
      'Analyzing requirements',
      'Structuring specification',
      'Adding implementation details',
      'Polishing output',
    ]}
  />

  {/* Live spec preview */}
  <SpecPreview
    content={streamingContent}
    format={specType}
    streaming={isGenerating}
  >
    {/* Render markdown/JSON with syntax highlighting */}
    {specType === 'markdown' ? (
      <MarkdownPreview content={streamingContent} />
    ) : (
      <JSONPreview content={streamingContent} />
    )}
  </SpecPreview>

  {/* Quality score */}
  <QualityScore
    score={calculateQuality(streamingContent)}
    breakdown={{
      completeness: 85,
      clarity: 90,
      actionability: 88,
    }}
  />

  {/* Refinement options */}
  <RefinementPanel>
    <RegenerateSection
      sections={detectSections(streamingContent)}
      onRegenerate={handleSectionRegenerate}
    />
    <AdjustTone
      current={detectedTone}
      onAdjust={handleToneAdjustment}
    />
    <AddDetails
      suggestions={missingDetails}
      onAdd={handleAddDetail}
    />
  </RefinementPanel>
</StepFour>
```

**Streaming Implementation**:
```typescript
async function generateSpecStreaming(params: GenerateParams) {
  const response = await fetch('/api/writer/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  let accumulated = ''

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break

    const chunk = decoder.decode(value)
    accumulated += chunk

    // Update UI with each chunk
    setStreamingContent(accumulated)

    // Update quality score in real-time
    updateQualityScore(accumulated)

    // Scroll to bottom
    scrollToBottom()
  }

  return accumulated
}
```

**Quality Scoring**:
```typescript
function calculateQualityScore(spec: string): QualityScore {
  const checks = {
    // Completeness: Has all necessary sections
    completeness: hasAllSections(spec) ? 100 :
      (countSections(spec) / requiredSections.length) * 100,

    // Clarity: Readability and structure
    clarity: calculateReadability(spec),

    // Actionability: Has specific, implementable details
    actionability: hasActionableDetails(spec) ? 100 : 70,

    // Technical depth: Includes tech stack, architecture
    technical: hasTechnicalDetails(spec) ? 100 : 60,
  }

  return {
    overall: Object.values(checks).reduce((a, b) => a + b) / 4,
    breakdown: checks,
  }
}
```

**Refinement Actions**:
```tsx
// Regenerate specific section
<button onClick={() => regenerateSection('Database Schema')}>
  <RefreshCw /> Regenerate this section
</button>

// Adjust tone
<ToneSlider
  value={tone}
  onChange={(newTone) => {
    adjustSpecTone(content, currentTone, newTone)
  }}
/>

// Add missing details
<SuggestionChip onClick={() => addDetail('API Endpoints')}>
  + Add API Endpoints
</SuggestionChip>
```

---

### Step 5: Save & Share

**Purpose**: Download, save to collection, or create new spec

**UI Components**:
```tsx
<StepFive>
  {/* Preview with actions */}
  <FinalPreview
    spec={generatedSpec}
    format={specType}
    quality={qualityScore}
  />

  {/* Primary actions */}
  <ActionButtons>
    <DownloadButton
      spec={generatedSpec}
      format={specType}
      filename={generateFilename(title)}
    />

    <SaveToCollectionButton
      spec={generatedSpec}
      onSave={handleSave}
    />

    <ShareButton
      spec={generatedSpec}
      onShare={handleShare}
    />
  </ActionButtons>

  {/* Secondary actions */}
  <SecondaryActions>
    <CopyToClipboard
      content={generatedSpec}
    />

    <EditInline
      content={generatedSpec}
      onSave={handleEdit}
    />

    <GenerateScreenshot
      spec={generatedSpec}
      onComplete={handleScreenshot}
    />
  </SecondaryActions>

  {/* Next steps */}
  <NextSteps>
    <SuggestedAction
      icon={<Code />}
      title="Build with Claude Code"
      description="Use this spec with Claude Code to generate your app"
      cta="Copy spec & open terminal"
    />

    <SuggestedAction
      icon={<Sparkles />}
      title="Create another spec"
      description="Your creative streak is on fire! 🔥"
      cta="Start new spec"
    />
  </NextSteps>
</StepFive>
```

**Download Implementation**:
```typescript
function downloadSpec(spec: string, format: 'markdown' | 'json', filename: string) {
  const blob = new Blob([spec], {
    type: format === 'markdown' ? 'text/markdown' : 'application/json'
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.${format === 'markdown' ? 'md' : 'json'}`
  a.click()

  URL.revokeObjectURL(url)

  // Track download
  analytics.track('spec_downloaded', {
    format,
    quality_score: qualityScore,
    category,
  })

  // Show success toast
  toast.success('Spec downloaded!', {
    description: 'Ready to build 🚀',
  })
}
```

## Advanced Features

### 1. Smart Auto-Complete

```typescript
// As user types, suggest completions
const [suggestions, setSuggestions] = useState<string[]>([])

const handleInputChange = async (value: string) => {
  if (value.length < 10) return

  // Debounced AI suggestion
  const completions = await getCompletions(value, {
    context: { category, pages, features },
    count: 3,
  })

  setSuggestions(completions)
}

// Show inline suggestions (like GitHub Copilot)
<InlineSuggestion
  suggestion={suggestions[0]}
  onAccept={() => {
    setIdea(idea + suggestions[0])
    setSuggestions([])
  }}
  onReject={() => setSuggestions(suggestions.slice(1))}
/>
```

### 2. Template Library

```tsx
<TemplateSelector
  templates={[
    {
      name: 'SaaS Starter',
      description: 'Dashboard, auth, billing, team management',
      popularity: 'high',
      preview: <TemplatePreview template="saas-starter" />,
    },
    {
      name: 'E-commerce Complete',
      description: 'Product catalog, cart, checkout, admin',
      popularity: 'high',
      preview: <TemplatePreview template="ecommerce" />,
    },
  ]}
  onSelect={loadTemplate}
/>
```

### 3. Collaborative Mode (Future)

```typescript
// Share Writer session with team
const sessionId = createCollaborativeSession()

// Real-time cursor tracking
<Presence
  channel={`writer-${sessionId}`}
  renderCursor={(user) => (
    <Cursor
      color={user.color}
      name={user.name}
      position={user.cursor}
    />
  )}
/>

// Live changes
supabase
  .channel(`writer-${sessionId}`)
  .on('broadcast', { event: 'change' }, ({ payload }) => {
    applyRemoteChange(payload)
  })
  .subscribe()
```

### 4. AI Suggestions Throughout

```typescript
// Suggest missing sections
if (!spec.includes('## Database')) {
  showSuggestion({
    type: 'missing_section',
    section: 'Database Schema',
    action: () => generateSection('database'),
  })
}

// Suggest improvements
if (qualityScore.actionability < 80) {
  showSuggestion({
    type: 'improve_actionability',
    message: 'Add more specific implementation details',
    action: () => enhanceDetails(),
  })
}

// Suggest related specs
const similar = await findSimilarSpecs(generatedSpec)
showSuggestion({
  type: 'similar_specs',
  specs: similar,
  message: 'Check out these related specs for inspiration',
})
```

## API Endpoints

### POST `/api/writer/generate`
```typescript
interface GenerateRequest {
  idea: string
  category: string
  pages: string[]
  features: string[]
  vibe?: string
  tone?: 'professional' | 'balanced' | 'playful'
  specType: 'markdown' | 'json'
  referenceImages?: string[]
}

interface GenerateResponse {
  // Streaming response
  // Each chunk is a piece of the spec
}
```

### POST `/api/writer/refine`
```typescript
interface RefineRequest {
  spec: string
  action: 'regenerate_section' | 'adjust_tone' | 'add_detail'
  params: {
    section?: string
    tone?: string
    detail?: string
  }
}
```

### POST `/api/writer/quality`
```typescript
interface QualityRequest {
  spec: string
}

interface QualityResponse {
  score: number
  breakdown: {
    completeness: number
    clarity: number
    actionability: number
    technical: number
  }
  suggestions: string[]
}
```

## State Management

```typescript
// Writer store (Zustand)
const useWriterStore = create<WriterState>((set) => ({
  // State
  step: 1,
  idea: '',
  category: null,
  pages: [],
  features: [],
  vibe: 'modern',
  tone: 'balanced',
  specType: 'markdown',
  generatedSpec: '',
  isGenerating: false,
  qualityScore: null,

  // Actions
  setStep: (step) => set({ step }),
  setIdea: (idea) => set({ idea }),
  addPage: (page) => set(state => ({
    pages: [...state.pages, page]
  })),
  removePage: (page) => set(state => ({
    pages: state.pages.filter(p => p !== page)
  })),
  toggleFeature: (feature) => set(state => ({
    features: state.features.includes(feature)
      ? state.features.filter(f => f !== feature)
      : [...state.features, feature]
  })),
  generateSpec: async () => {
    set({ isGenerating: true })
    // Generate...
    set({ isGenerating: false })
  },
}))
```

## Keyboard Shortcuts

Global shortcuts in Writer:
- `⌘K`: Open command palette
- `⌘→`: Next step
- `⌘←`: Previous step
- `⌘↵`: Generate spec
- `⌘S`: Save draft
- `⌘⇧S`: Save to collection
- `⌘D`: Download spec
- `⌘/`: Focus search/input
- `Esc`: Cancel/close

## Analytics Events

```typescript
analytics.track('writer.step_completed', {
  step: stepNumber,
  duration: timeSpent,
})

analytics.track('writer.spec_generated', {
  category,
  specType,
  quality_score: qualityScore,
  generation_time: generationDuration,
  refinement_count: refinementsMade,
})

analytics.track('writer.spec_downloaded', {
  format: specType,
  quality_score: qualityScore,
})
```

## Accessibility

- Full keyboard navigation
- Screen reader announcements for streaming content
- ARIA live regions for progress updates
- Focus management between steps
- High contrast mode support
- Reduced motion for animations

## Performance Targets

- Time to first interaction: < 1s
- Streaming starts: < 2s from click
- Generation completion: < 10s for 2000 token spec
- Quality score calculation: < 100ms
- Step transitions: < 200ms

## Testing Checklist

- [ ] Can complete full flow without mouse
- [ ] Streaming works on slow connections
- [ ] Auto-save recovers lost work
- [ ] Suggestions are relevant and helpful
- [ ] Quality score is accurate
- [ ] Download works in all browsers
- [ ] Mobile experience is smooth
- [ ] Refin refinement preserves context
- [ ] Error states are helpful
- [ ] Analytics events fire correctly

---

**Next**: See `04-FEED-BROWSE.md` for the spec browsing experience
