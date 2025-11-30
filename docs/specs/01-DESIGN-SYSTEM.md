# Design System Specification

> **"Every pixel should spark joy. Every interaction should feel like butter."**

## Overview

The VibeCherry design system is built on three pillars:
1. **Cherry Delight** - Playful yet professional
2. **Butter Smooth** - Effortless interactions
3. **Accessible First** - Beautiful for everyone

## Color System

### Base Palette

```typescript
const colors = {
  // Cherry Reds (Primary)
  cherry: {
    50: '#fff1f3',
    100: '#ffe4e8',
    200: '#fecdd6',
    300: '#fda4b4',
    400: '#fb718d',
    500: '#f43f5e',  // Main brand color
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },

  // Dark Surfaces
  dark: {
    50: '#f8f8f8',
    100: '#efefef',
    200: '#dcdcdc',
    300: '#bdbdbd',
    400: '#989898',
    500: '#7c7c7c',
    600: '#656565',
    700: '#525252',
    800: '#464646',
    900: '#3d3d3d',
    950: '#0a0a0a',  // True black background
  },

  // Semantic Colors
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fcd34d',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#93c5fd',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
}
```

### Glassmorphism
```css
.glass {
  background: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-cherry {
  background: rgba(244, 63, 94, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 63, 94, 0.2);
}
```

### Color Usage Rules

1. **Background Hierarchy**
   - `dark-950`: Page background
   - `dark-900`: Card background
   - `dark-800`: Nested card background
   - `dark-700`: Input backgrounds
   - `dark-600`: Borders

2. **Text Hierarchy**
   - `white`: Headings, emphasis
   - `gray-100`: Body text
   - `gray-400`: Secondary text
   - `gray-600`: Disabled text

3. **Cherry Accent**
   - Primary CTAs
   - Active states
   - Hover effects
   - Focus rings
   - Brand moments

## Typography

### Font Families
```typescript
const fonts = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Monaco', 'monospace'],
  display: ['Inter', 'sans-serif'], // Use weight 900 for display
}
```

### Type Scale
```typescript
const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
  '8xl': ['6rem', { lineHeight: '1' }],           // 96px
  '9xl': ['8rem', { lineHeight: '1' }],           // 128px
}
```

### Typography Components

```typescript
// Heading sizes
const headings = {
  h1: 'text-5xl md:text-7xl font-black tracking-tight',
  h2: 'text-4xl md:text-5xl font-bold',
  h3: 'text-3xl md:text-4xl font-bold',
  h4: 'text-2xl md:text-3xl font-semibold',
  h5: 'text-xl md:text-2xl font-semibold',
  h6: 'text-lg md:text-xl font-semibold',
}

// Body text
const body = {
  large: 'text-lg leading-relaxed',
  base: 'text-base leading-normal',
  small: 'text-sm leading-normal',
}

// Special text
const special = {
  gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-cherry-400 to-cherry-600',
  glow: 'text-cherry-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]',
  code: 'font-mono text-sm bg-dark-800 px-1.5 py-0.5 rounded',
}
```

## Spacing System

### Scale (Tailwind default, but explicit)
```
0: 0px
px: 1px
0.5: 0.125rem (2px)
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
32: 8rem (128px)
```

### Component Spacing Rules
- **Buttons**: `px-6 py-3` (base), `px-8 py-4` (large)
- **Cards**: `p-6` (base), `p-8` (large)
- **Sections**: `py-20` (mobile), `py-32` (desktop)
- **Grid gaps**: `gap-4` (tight), `gap-6` (normal), `gap-8` (loose)

## Components

### Buttons

```typescript
// Button variants
const buttonVariants = {
  primary: 'bg-cherry-500 hover:bg-cherry-600 text-white shadow-lg shadow-cherry-500/30 hover:shadow-cherry-500/50',
  secondary: 'bg-dark-700 hover:bg-dark-600 text-white',
  ghost: 'hover:bg-dark-800 text-gray-100',
  outline: 'border-2 border-cherry-500 text-cherry-400 hover:bg-cherry-500 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}

// Button sizes
const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
}

// Button states
const buttonStates = {
  loading: 'opacity-70 cursor-not-allowed',
  disabled: 'opacity-50 cursor-not-allowed',
  active: 'ring-2 ring-cherry-400 ring-offset-2 ring-offset-dark-950',
}
```

**Implementation:**
```tsx
<Button
  variant="primary"
  size="lg"
  onClick={handleClick}
  loading={isLoading}
  leftIcon={<Sparkles />}
>
  Generate Spec
</Button>
```

### Cards

```typescript
const cardVariants = {
  default: 'bg-dark-900 border border-dark-700 rounded-xl p-6',
  glass: 'glass rounded-xl p-6',
  elevated: 'bg-dark-900 rounded-xl p-6 shadow-2xl',
  interactive: 'bg-dark-900 border border-dark-700 rounded-xl p-6 hover:border-cherry-500/50 transition-all cursor-pointer hover:-translate-y-1',
}
```

**Implementation:**
```tsx
<Card variant="interactive" onClick={handleClick}>
  <CardHeader>
    <CardTitle>Spec Title</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Inputs

```typescript
const inputVariants = {
  default: 'bg-dark-800 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cherry-500 focus:border-transparent',
  error: 'bg-dark-800 border border-red-500 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500',
  success: 'bg-dark-800 border border-green-500 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500',
}
```

**Features:**
- Auto-focus on mount (when appropriate)
- Clear button (X) when has value
- Show/hide password toggle
- Character counter for limited inputs
- Real-time validation feedback

### Badges

```typescript
const badgeVariants = {
  weekend: 'bg-green-500/10 text-green-400 border border-green-500/20',
  production: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  enterprise: 'bg-red-500/10 text-red-400 border border-red-500/20',
  new: 'bg-cherry-500/10 text-cherry-400 border border-cherry-500/20',
}
```

### Toasts (Using Sonner)

```typescript
// Success toast
toast.success('Spec created!', {
  description: 'Your spec is ready to download',
  action: {
    label: 'View',
    onClick: () => router.push(`/specs/${spec.id}`)
  }
})

// Error toast
toast.error('Generation failed', {
  description: error.message,
  action: {
    label: 'Retry',
    onClick: retryGeneration
  }
})

// With custom styling
toast.custom((t) => (
  <div className="glass-cherry rounded-xl p-4">
    <div className="flex items-start gap-3">
      <Cherry className="w-6 h-6 text-cherry-400" />
      <div>
        <h3 className="font-semibold">Achievement Unlocked!</h3>
        <p className="text-sm text-gray-400">First spec created 🎉</p>
      </div>
    </div>
  </div>
))
```

## Motion & Animation

### Timing Functions
```typescript
const easing = {
  // Standard curves
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Playful spring
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Sharp
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
}

const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
}
```

### Framer Motion Variants

```typescript
// Fade in from bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// Scale in
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1] // Spring
    }
  }
}

// Slide in from side
const slideIn = (direction: 'left' | 'right') => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -20 : 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
})

// Stagger children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}
```

### Page Transitions
```typescript
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
}
```

### Micro-interactions

```typescript
// Hover grow
const hoverGrow = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

// Glow on hover
const glowOnHover = {
  rest: { boxShadow: '0 0 0 rgba(244, 63, 94, 0)' },
  hover: { boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)' }
}

// Shake (for errors)
const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
}
```

### Loading States

```typescript
// Skeleton loader
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-dark-700 rounded w-3/4"></div>
  <div className="h-4 bg-dark-700 rounded w-1/2"></div>
</div>

// Spinner
<motion.div
  className="w-8 h-8 border-4 border-dark-600 border-t-cherry-500 rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
/>

// Progress bar
<motion.div
  className="h-2 bg-cherry-500 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3 }}
/>
```

## Icons

### Icon System (Lucide React)
```typescript
import {
  Sparkles,    // AI/Magic
  Download,    // Download
  Heart,       // Like/Favorite
  Share2,      // Share
  Zap,         // Fast/Energy
  FileText,    // Document
  Code,        // Code
  Palette,     // Design
  Users,       // Community
  Search,      // Search
  Command,     // Keyboard shortcut
  Copy,        // Copy
  Check,       // Success
  X,           // Close/Error
  ChevronDown, // Dropdown
  MoreHorizontal, // More options
} from 'lucide-react'
```

### Icon Sizes
```typescript
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}
```

## Acidentiton System (Unique Avatars)

### Generation Algorithm
```typescript
function generateAcidentiton(seed: string) {
  // Use seed for deterministic random
  const rng = seedRandom(seed)

  // Generate colors from seed
  const hue = rng() * 360
  const colors = {
    primary: `hsl(${hue}, 70%, 60%)`,
    secondary: `hsl(${(hue + 120) % 360}, 70%, 50%)`,
    accent: `hsl(${(hue + 240) % 360}, 70%, 70%)`,
  }

  // Generate geometric pattern
  const shapes = ['circle', 'square', 'triangle', 'hexagon']
  const pattern = {
    shape: shapes[Math.floor(rng() * shapes.length)],
    count: Math.floor(rng() * 5) + 3,
    rotation: rng() * 360,
    scale: rng() * 0.5 + 0.75,
  }

  return { colors, pattern }
}
```

### SVG Implementation
```tsx
<svg viewBox="0 0 100 100" className="w-full h-full">
  <defs>
    <linearGradient id={`grad-${seed}`}>
      <stop offset="0%" stopColor={colors.primary} />
      <stop offset="100%" stopColor={colors.secondary} />
    </linearGradient>
  </defs>

  {/* Generate shapes based on pattern */}
  {Array.from({ length: pattern.count }).map((_, i) => (
    <g key={i} transform={`rotate(${pattern.rotation * i} 50 50)`}>
      {/* Render shape */}
    </g>
  ))}
</svg>
```

## Accessibility Features

### Focus Management
```css
/* Visible focus rings */
.focus-visible {
  @apply outline-none ring-2 ring-cherry-500 ring-offset-2 ring-offset-dark-950;
}

/* Custom focus for specific elements */
button:focus-visible {
  @apply outline-none ring-2 ring-cherry-400 ring-offset-2 ring-offset-dark-950;
}
```

### Screen Reader Text
```tsx
<span className="sr-only">Accessible description</span>
```

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

<input aria-describedby="email-error" />
<p id="email-error" role="alert">Invalid email</p>
```

### Keyboard Shortcuts
```tsx
// Global shortcuts
const shortcuts = {
  'cmd+k': 'Open command palette',
  'cmd+/': 'Toggle search',
  'cmd+n': 'New spec',
  'esc': 'Close modal/cancel',
  'g h': 'Go to home',
  'g f': 'Go to feed',
  'g w': 'Go to writer',
}
```

## Responsive Design

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

### Mobile-First Approach
```tsx
// Base styles apply to mobile
// Use min-width media queries to enhance
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

### Touch Targets
```css
/* Minimum 44x44px touch targets */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}
```

## Dark Mode (Default)

### Light Mode Support (Future)
```typescript
// Use CSS variables for theme switching
:root {
  --background: 10 10% 4%;
  --foreground: 0 0% 98%;
  --cherry: 346 77% 60%;
}

[data-theme="light"] {
  --background: 0 0% 100%;
  --foreground: 0 0% 4%;
  --cherry: 346 77% 50%;
}
```

## Empty States

```tsx
<EmptyState
  icon={<FileText className="w-16 h-16 text-gray-600" />}
  title="No specs yet"
  description="Create your first spec to get started"
  action={{
    label: "Create Spec",
    onClick: () => router.push('/writer')
  }}
/>
```

## Error States

```tsx
<ErrorState
  icon={<X className="w-16 h-16 text-red-400" />}
  title="Something went wrong"
  description={error.message}
  actions={[
    {
      label: "Try Again",
      onClick: retry
    },
    {
      label: "Go Home",
      onClick: () => router.push('/'),
      variant: "ghost"
    }
  ]}
/>
```

## Implementation Checklist

- [ ] Set up Tailwind config with custom colors
- [ ] Create base component library (Button, Card, Input)
- [ ] Implement Framer Motion variants
- [ ] Add Acidentiton generator
- [ ] Set up keyboard shortcut system
- [ ] Implement toast notifications
- [ ] Create empty/error state components
- [ ] Add focus management
- [ ] Test with screen readers
- [ ] Verify touch targets on mobile
- [ ] Test reduced motion preferences
- [ ] Verify color contrast ratios

---

**Next**: See `02-LANDING-PAGE.md` for using this design system in practice
