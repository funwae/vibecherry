# 🚀 VibeCherry Quick Start Guide

> **For Vercel Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

Get your spec library up and running locally in 15 minutes.

## Prerequisites

Before you begin, make sure you have:
- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Supabase account** (free tier works great)
- **DeepSeek API key** (for AI spec generation)
- **Redis** (optional, for screenshot queue - can skip initially)

## Step 1: Project Setup

```bash
# Navigate to the project directory
cd vibecherry-complete

# Install dependencies
npm install

# or if you prefer yarn
yarn install
```

## Step 2: Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (takes ~2 minutes)
3. Navigate to **Project Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 2.2 Run Database Migrations

1. In your Supabase project, go to **SQL Editor**
2. Open the `DATABASE_SCHEMA.sql` file from this project
3. Copy the entire contents and paste it into the SQL Editor
4. Click **Run** to execute all the migrations

This will create all necessary tables, indexes, functions, and Row Level Security policies.

### 2.3 Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name it: `spec-screenshots`
4. Make it **public**
5. Set file size limit to **5MB**
6. Allowed MIME types: `image/png`

## Step 3: Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key

# Redis (optional - for screenshot queue)
REDIS_URL=redis://localhost:6379

# Screenshot Service
SCREENSHOT_BUCKET=spec-screenshots
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
FREE_SPECS_PER_MONTH=5
```

### Getting a DeepSeek API Key

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up for an account
3. Navigate to API Keys
4. Create a new API key
5. Copy it to your `.env.local` file

## Step 4: Run the Development Server

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)! 🎉

## Step 5: Create Your First Account

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click **Get Started** or **Sign Up**
3. Create an account using email/password
4. Complete the profile setup (choose a username)

## Step 6: Test The Writer

1. Go to **The Writer** from the navigation
2. Click **Start Creating**
3. Follow the guided wizard:
   - **Step 1**: Enter project title and description
   - **Step 2**: Select category and difficulty
   - **Step 3**: Choose vibe and add features
   - **Step 4**: Generate your spec with AI
4. Download your generated spec!

## Optional: Screenshot Service Setup

The screenshot service generates visual previews of specs. It's optional but highly recommended.

### Prerequisites
- Redis running locally or a Redis cloud instance

### Setup

1. **Install Redis** (if not already installed)

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Or use Redis Cloud (free tier available)
# Get connection URL from redis.com
```

2. **Start the screenshot worker** (in a separate terminal)

```bash
npm run worker
```

The worker will:
- Listen for new specs
- Generate screenshots using Puppeteer
- Upload to Supabase Storage
- Update spec records with screenshot URLs

## Project Structure

```
vibecherry/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── (marketing)/                # Marketing pages (grouped route)
│   ├── (app)/                      # Authenticated app (grouped route)
│   │   ├── writer/                 # AI spec generator
│   │   ├── feed/                   # Browse all specs
│   │   ├── collections/            # User collections
│   │   └── profile/                # User profile & settings
│   └── api/
│       ├── writer/generate/        # POST: Generate spec with AI
│       ├── specs/                  # CRUD operations for specs
│       ├── feed/                   # GET: List specs with filters
│       ├── upvote/                 # POST: Toggle upvote
│       ├── collections/            # CRUD for collections
│       └── render/                 # POST: Queue screenshot job
├── components/
│   ├── Writer/                     # Multi-step spec creator
│   ├── SpecRenderer/               # Visual spec preview
│   ├── Feed/                       # Spec browsing components
│   └── Acidentiton/                # Avatar generation
├── lib/
│   ├── supabase/                   # Database clients
│   ├── deepseek/                   # AI integration
│   └── types.ts                    # TypeScript types
├── services/
│   └── screenshot/                 # Screenshot worker
├── DATABASE_SCHEMA.sql             # Complete DB setup
├── README.md                       # Full documentation
└── QUICKSTART.md                   # This file!
```

## Next Steps

### 1. Customize Your Instance

- **Branding**: Update colors in `tailwind.config.js`
- **Landing page**: Edit `app/page.tsx`
- **Categories**: Modify categories in `lib/types.ts`
- **Usage limits**: Change `FREE_SPECS_PER_MONTH` in `.env.local`

### 2. Add Seed Data

Create some initial specs to populate your feed:

```sql
-- Run in Supabase SQL Editor
-- First, create a system profile (use your auth user ID)
INSERT INTO profiles (id, username, display_name, acidentiton_seed)
VALUES (
  'your-auth-user-id',
  'vibecherry',
  'VibeCherry Team',
  'cherry-official'
);

-- Then add some featured specs
INSERT INTO specs (
  created_by,
  title,
  description,
  spec_type,
  content,
  category,
  difficulty,
  tags,
  vibe,
  is_featured
) VALUES (
  'your-auth-user-id',
  'Modern SaaS Dashboard',
  'A complete dashboard specification with analytics, user management, and settings.',
  'markdown',
  '# SaaS Dashboard Spec\n\n...',
  'saas-dashboard',
  'production',
  ARRAY['react', 'tailwind', 'analytics'],
  'modern',
  true
);
```

### 3. Deploy to Production

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings > Environment Variables
```

#### Deploy to other platforms

VibeCherry works on any platform that supports Next.js:
- **Vercel** (recommended, zero config)
- **Netlify** (works great)
- **AWS Amplify** (requires some config)
- **Railway** (simple deployments)
- **Fly.io** (for full control)

### 4. Set Up Redis for Production

For production, use a managed Redis service:

- **Upstash** (serverless, generous free tier)
- **Redis Cloud** (enterprise-grade)
- **Railway Redis** (easy deploy)

Update `REDIS_URL` in your production environment variables.

## Troubleshooting

### "Supabase client not initialized"
- Check that all environment variables in `.env.local` are correct
- Verify you're using `NEXT_PUBLIC_` prefix for client-side variables
- Restart the dev server after changing env vars

### "DeepSeek API error"
- Verify your API key is correct
- Check you have credits in your DeepSeek account
- Test the API key with a curl request

### "Database error"
- Ensure you ran the complete `DATABASE_SCHEMA.sql`
- Check Row Level Security policies are active
- Verify your service role key has proper permissions

### Screenshots not generating
- Make sure Redis is running
- Start the worker with `npm run worker`
- Check worker logs for errors
- Verify Puppeteer can launch (may need `--no-sandbox` flag)

### Build errors
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

## Need Help?

- **Documentation**: See `README.md` for full docs
- **Database schema**: Check `DATABASE_SCHEMA.sql`
- **API routes**: Look in `app/api/` for examples
- **Components**: Browse `components/` for UI patterns

## What's Next?

Now that you're up and running:

1. **Generate your first spec** with The Writer
2. **Browse the feed** to see specs
3. **Create collections** to organize favorites
4. **Customize the design** to match your brand
5. **Deploy to production** and share with the world!

---

**Made with 🍒 and detailed documentation**

*The sweetest specs on the web*
