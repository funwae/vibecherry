# 🍒 VibeCherry - The Sweetest Specs on the Web

**The spec library that AI coding tools actually need.**

Instead of blindly generating code from vague descriptions, start with proven MD/JSON specifications. Browse hundreds of battle-tested specs, remix them, or generate new ones with AI.

## 🎯 The Core Insight

Everyone's racing to build "AI code generators" but missing the point: **the specification IS the product**.

- Code is disposable (AI can rebuild it anytime)
- Specs are valuable (they capture intent, structure, and design decisions)
- Developers need a library of proven patterns, not another code generator

## ✨ Features

### Browse & Download
- **Hundreds of specs** - Categorized by type, complexity, and vibe
- **Instant downloads** - Copy-paste ready MD/JSON files
- **No account needed** - All specs are free to download

### The Writer (AI Spec Generator)
- **Guided creation** - Step-by-step wizard to define your project
- **DeepSeek powered** - Fast, accurate spec generation
- **Real-time preview** - Watch your spec being built
- **Similar suggestions** - Find related specs while building

### Collections & Community
- **Save collections** - Organize your favorite specs
- **Upvote & rate** - Surface the best specs
- **Remix counter** - See what's popular
- **Profile system** - Build your spec library

### Visual Previews
- **Auto-screenshots** - See what each spec builds
- **Vibe preview** - Visual representation before downloading
- **Acidentiton avatars** - Unique visual identity for each spec

## 🏗️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **DeepSeek API** (Spec generation)
- **Puppeteer** (Screenshot generation)
- **BullMQ** (Job queue for rendering)
- **Framer Motion** (Animations)

## 📦 Project Structure

```
vibecherry/
├── app/
│   ├── (marketing)/          # Landing page
│   ├── (app)/
│   │   ├── writer/           # AI spec generator
│   │   ├── collections/      # User collections
│   │   ├── profile/          # User profiles & settings
│   │   └── feed/             # Browse all specs
│   └── api/
│       ├── writer/generate/  # DeepSeek integration
│       ├── specs/            # CRUD operations
│       ├── feed/             # Spec listing
│       ├── upvote/           # Voting system
│       ├── collections/      # Collection management
│       └── render/           # Screenshot pipeline
├── components/
│   ├── Writer/              # Multi-step spec creator
│   ├── SpecRenderer/        # Visual spec preview
│   ├── Feed/                # Spec browsing components
│   └── Acidentiton/         # Avatar generation
├── lib/
│   ├── supabase/            # DB client & types
│   └── deepseek/            # API integration
└── services/
    └── screenshot/          # Puppeteer screenshot service
```

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

**For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.**

Quick steps:
1. Push code to GitHub
2. Import to Vercel
3. Set up Supabase database
4. Add environment variables in Vercel
5. Deploy!

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- Supabase account (for local testing)
- DeepSeek API key

#### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Add your keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - DEEPSEEK_API_KEY

# 3. Run database migrations in Supabase SQL Editor
# See DATABASE_SCHEMA.sql

# 4. Start development server
npm run dev
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Open `DATABASE_SCHEMA.sql` from this project
4. Copy and paste the entire contents
5. Click **Run** to execute

For production, you'll set up the database after deploying to Vercel (see DEPLOYMENT.md).

## 🎨 Key Features Breakdown

### 1. Spec Categories
- **Landing Pages** - Hero sections, CTAs, pricing
- **SaaS Dashboards** - Analytics, tables, forms
- **API Docs** - Reference sites, guides
- **Portfolios** - Personal sites, case studies
- **E-commerce** - Product pages, checkout flows

### 2. Difficulty Levels
- 🟢 **Weekend Project** - Build in hours
- 🟡 **Production Ready** - Full-featured apps
- 🔴 **Enterprise** - Complex systems

### 3. The Writer Flow
1. **Define** - What are you building?
2. **Structure** - Pages and features
3. **Vibe** - Visual style and tone
4. **Generate** - AI creates your spec
5. **Preview** - See it rendered
6. **Export** - Download or save to collection

### 4. Screenshot Pipeline
- Specs queued for rendering via BullMQ
- Puppeteer generates screenshot
- Uploaded to Supabase Storage
- Cached for 30 days

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DeepSeek
DEEPSEEK_API_KEY=your_deepseek_key

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# Screenshot Service
SCREENSHOT_BUCKET=spec-screenshots
```

## 📊 Database Schema

### Tables
- `profiles` - User profiles and Acidentiton data
- `specs` - MD/JSON specifications
- `collections` - User spec collections
- `collection_specs` - Many-to-many relationship
- `upvotes` - User votes on specs
- `renders` - Screenshot metadata

See `DATABASE_SCHEMA.sql` for complete schema.

## 🎯 Monetization Ideas

### Free Tier
- Download any spec
- Generate 5 specs/month with The Writer
- 3 public collections

### Pro ($9/month)
- Unlimited spec generation
- Unlimited private collections
- Priority screenshot rendering
- Custom Acidentiton colors
- Export to Figma/Notion

### Teams ($29/month)
- Shared team collections
- Collaboration features
- Custom branding
- API access

## 🍒 The Vibe

VibeCherry is playful, fast, and surprisingly useful. Key brand elements:

- **Cherry emoji everywhere** 🍒
- **Acidentiton avatars** - Unique geometric identities
- **Smooth animations** - Framer Motion magic
- **Dark mode first** - With cherry accent colors
- **Casual copy** - "The sweetest specs on the web"

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run worker       # Start screenshot worker
npm run db:migrate   # Run database migrations
npm run type-check   # TypeScript checking
```

## 📝 Contributing

This is a solo project for now, but ideas welcome!

## 📄 License

MIT - Build whatever you want with these specs!

---

**Made with 🍒 and an insane amount of code**

*Because the spec is the product, and the product should be delicious.*
