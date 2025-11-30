/**
 * Seed Script - Generate Hundreds of Specs with AI
 * 
 * This script uses DeepSeek AI to automatically generate a diverse library
 * of specifications across all categories, difficulties, and vibes.
 * 
 * Usage:
 *   npm run seed:specs
 *   npm run seed:specs -- --count 50
 *   npm run seed:specs -- --category saas-dashboard
 */

import { createClient } from '@supabase/supabase-js'
import { generateSpec } from '../lib/deepseek/client'
import { CATEGORIES, DIFFICULTIES, VIBES, SpecCategory, SpecDifficulty } from '../lib/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface SeedSpec {
  title: string
  description: string
  category: SpecCategory
  difficulty: SpecDifficulty
  vibe: string
  pages: string[]
  features: string[]
  tags: string[]
}

// Pre-defined spec templates for consistent generation
const SPEC_TEMPLATES: Record<SpecCategory, Array<Partial<SeedSpec>>> = {
  'landing-page': [
    {
      title: 'Modern SaaS Landing Page',
      description: 'A conversion-optimized landing page for a SaaS product with hero section, features, pricing, and testimonials.',
      pages: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
      features: ['Hero Section', 'Feature Grid', 'Pricing Tiers', 'Testimonials', 'CTA Sections'],
      tags: ['saas', 'marketing', 'conversion'],
    },
    {
      title: 'Creative Agency Portfolio',
      description: 'A stunning portfolio site for a creative agency showcasing work, team, and services.',
      pages: ['Home', 'Work', 'Services', 'Team', 'Contact'],
      features: ['Project Gallery', 'Case Studies', 'Team Profiles', 'Contact Form'],
      tags: ['portfolio', 'agency', 'creative'],
    },
    {
      title: 'E-commerce Product Launch',
      description: 'A high-converting product launch page with video, features, and pre-order functionality.',
      pages: ['Home', 'Product', 'Features', 'Reviews', 'Pre-order'],
      features: ['Video Hero', 'Product Showcase', 'Social Proof', 'Pre-order System'],
      tags: ['ecommerce', 'product', 'launch'],
    },
  ],
  'saas-dashboard': [
    {
      title: 'Analytics Dashboard',
      description: 'A comprehensive analytics dashboard with real-time metrics, charts, and data visualization.',
      pages: ['Dashboard', 'Analytics', 'Reports', 'Settings'],
      features: ['Real-time Metrics', 'Interactive Charts', 'Data Export', 'Custom Reports'],
      tags: ['analytics', 'data', 'metrics'],
    },
    {
      title: 'Project Management Dashboard',
      description: 'A project management dashboard with task tracking, team collaboration, and timeline views.',
      pages: ['Dashboard', 'Projects', 'Tasks', 'Team', 'Calendar'],
      features: ['Task Management', 'Team Collaboration', 'Timeline View', 'Notifications'],
      tags: ['project-management', 'collaboration', 'tasks'],
    },
    {
      title: 'CRM Dashboard',
      description: 'A customer relationship management dashboard with contact management and sales pipeline.',
      pages: ['Dashboard', 'Contacts', 'Deals', 'Analytics', 'Settings'],
      features: ['Contact Management', 'Sales Pipeline', 'Email Integration', 'Activity Tracking'],
      tags: ['crm', 'sales', 'contacts'],
    },
  ],
  'api-docs': [
    {
      title: 'REST API Documentation',
      description: 'Comprehensive REST API documentation with endpoints, authentication, and code examples.',
      pages: ['Overview', 'Authentication', 'Endpoints', 'Examples', 'SDKs'],
      features: ['Interactive API Explorer', 'Code Examples', 'SDK Documentation', 'Rate Limits'],
      tags: ['api', 'rest', 'documentation'],
    },
    {
      title: 'GraphQL API Reference',
      description: 'Complete GraphQL API reference with schema, queries, mutations, and subscriptions.',
      pages: ['Getting Started', 'Schema', 'Queries', 'Mutations', 'Subscriptions'],
      features: ['GraphQL Playground', 'Schema Explorer', 'Code Examples', 'Type Definitions'],
      tags: ['graphql', 'api', 'reference'],
    },
  ],
  'portfolio': [
    {
      title: 'Developer Portfolio',
      description: 'A modern developer portfolio showcasing projects, skills, and experience.',
      pages: ['Home', 'Projects', 'About', 'Skills', 'Contact'],
      features: ['Project Showcase', 'Skills Display', 'Resume Download', 'Contact Form'],
      tags: ['portfolio', 'developer', 'personal'],
    },
    {
      title: 'Designer Portfolio',
      description: 'A beautiful portfolio for a designer featuring work, process, and case studies.',
      pages: ['Home', 'Work', 'Process', 'About', 'Contact'],
      features: ['Work Gallery', 'Case Studies', 'Process Timeline', 'Contact Form'],
      tags: ['portfolio', 'design', 'creative'],
    },
  ],
  'e-commerce': [
    {
      title: 'Modern E-commerce Store',
      description: 'A full-featured e-commerce store with product catalog, cart, checkout, and user accounts.',
      pages: ['Home', 'Shop', 'Product', 'Cart', 'Checkout', 'Account'],
      features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'User Accounts', 'Order Tracking'],
      tags: ['ecommerce', 'shop', 'products'],
    },
    {
      title: 'Marketplace Platform',
      description: 'A multi-vendor marketplace platform with seller dashboards and buyer experience.',
      pages: ['Home', 'Browse', 'Product', 'Seller', 'Dashboard', 'Account'],
      features: ['Multi-vendor Support', 'Seller Dashboard', 'Reviews', 'Messaging'],
      tags: ['marketplace', 'multi-vendor', 'platform'],
    },
  ],
  'blog': [
    {
      title: 'Modern Blog Platform',
      description: 'A feature-rich blog platform with categories, tags, search, and author profiles.',
      pages: ['Home', 'Posts', 'Categories', 'Authors', 'About'],
      features: ['Post Categories', 'Tag System', 'Search', 'Author Profiles', 'Comments'],
      tags: ['blog', 'content', 'cms'],
    },
  ],
  'admin-panel': [
    {
      title: 'Admin Dashboard',
      description: 'A comprehensive admin panel for managing users, content, and system settings.',
      pages: ['Dashboard', 'Users', 'Content', 'Settings', 'Analytics'],
      features: ['User Management', 'Content Management', 'System Settings', 'Activity Logs'],
      tags: ['admin', 'management', 'dashboard'],
    },
  ],
  'marketing-site': [
    {
      title: 'Marketing Website',
      description: 'A marketing website with landing pages, blog, resources, and lead generation.',
      pages: ['Home', 'About', 'Services', 'Blog', 'Resources', 'Contact'],
      features: ['Lead Generation', 'Resource Library', 'Blog', 'Contact Forms'],
      tags: ['marketing', 'lead-gen', 'content'],
    },
  ],
  'documentation': [
    {
      title: 'Product Documentation',
      description: 'Comprehensive product documentation with guides, tutorials, and API reference.',
      pages: ['Getting Started', 'Guides', 'Tutorials', 'API Reference', 'FAQ'],
      features: ['Search', 'Code Examples', 'Interactive Tutorials', 'Version History'],
      tags: ['docs', 'product', 'reference'],
    },
  ],
  'other': [
    {
      title: 'Community Forum',
      description: 'A community forum with discussions, topics, user profiles, and moderation.',
      pages: ['Home', 'Topics', 'Discussions', 'Users', 'Profile'],
      features: ['Discussion Threads', 'User Profiles', 'Moderation', 'Search'],
      tags: ['forum', 'community', 'discussion'],
    },
  ],
}

// Generate additional random specs
function generateRandomSpec(category: SpecCategory): SeedSpec {
  const templates = SPEC_TEMPLATES[category] || []
  const template = templates[Math.floor(Math.random() * templates.length)] || {}
  
  const difficulties: SpecDifficulty[] = ['weekend', 'production', 'enterprise']
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
  const randomVibe = VIBES[Math.floor(Math.random() * VIBES.length)]
  
  return {
    title: template.title || `${category.replace('-', ' ')} Application`,
    description: template.description || `A ${category.replace('-', ' ')} application with modern features and design.`,
    category,
    difficulty: template.difficulty || randomDifficulty,
    vibe: template.vibe || randomVibe,
    pages: template.pages || ['Home', 'About', 'Contact'],
    features: template.features || ['User Authentication', 'Data Management'],
    tags: template.tags || [category.split('-')[0]],
  }
}

async function createSystemUser() {
  // Try to find existing system user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'vibecherry')
    .single()

  if (existing) {
    console.log('✅ Using existing system user')
    return existing.id
  }

  // If no system user exists, use environment variable or prompt
  const systemUserId = process.env.SYSTEM_USER_ID
  
  if (!systemUserId) {
    console.error('\n❌ System user not found!')
    console.error('\nPlease create a system user first:')
    console.error('1. Go to Supabase Dashboard > Authentication > Users')
    console.error('2. Click "Add User"')
    console.error('3. Create user with email: system@vibecherry.local')
    console.error('4. Copy the user ID')
    console.error('5. Set SYSTEM_USER_ID environment variable or run SQL in scripts/create-system-user.sql\n')
    throw new Error('System user not found. Set SYSTEM_USER_ID environment variable or create user in Supabase.')
  }

  // Try to create profile for the provided user ID
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: systemUserId,
      username: 'vibecherry',
      display_name: 'VibeCherry',
      acidentiton_seed: 'vibecherry-system',
      is_pro: true,
    })

  if (error) {
    if (error.message.includes('duplicate')) {
      return systemUserId
    }
    throw new Error(`Failed to create system user: ${error.message}`)
  }

  console.log('✅ Created system user profile')
  return systemUserId
}

async function generateAndSaveSpec(specData: SeedSpec, userId: string) {
  try {
    console.log(`Generating: ${specData.title}...`)

    // Generate spec content using AI
    const content = await generateSpec({
      title: specData.title,
      description: specData.description,
      category: specData.category,
      specType: 'markdown',
      vibe: specData.vibe,
      features: specData.features,
      pages: specData.pages,
    })

    // Save to database
    const { data, error } = await supabase
      .from('specs')
      .insert({
        created_by: userId,
        title: specData.title,
        description: specData.description,
        spec_type: 'markdown',
        content,
        category: specData.category,
        difficulty: specData.difficulty,
        tags: specData.tags,
        vibe: specData.vibe,
        is_public: true,
        is_featured: Math.random() > 0.7, // 30% chance of being featured
      })
      .select()
      .single()

    if (error) {
      console.error(`Error saving ${specData.title}:`, error.message)
      return false
    }

    console.log(`✅ Created: ${specData.title}`)
    return true
  } catch (error) {
    console.error(`Error generating ${specData.title}:`, error)
    return false
  }
}

async function seedSpecs(options: { count?: number; category?: SpecCategory } = {}) {
  const count = options.count || 100
  const targetCategory = options.category

  console.log(`\n🍒 Starting VibeCherry Spec Seeding`)
  console.log(`Generating ${count} specs...\n`)

  // Create system user
  const userId = await createSystemUser()

  // Generate specs
  const categories = targetCategory ? [targetCategory] : CATEGORIES.map(c => c.value)
  const specs: SeedSpec[] = []

  // First, use templates
  for (const category of categories) {
    const templates = SPEC_TEMPLATES[category] || []
    for (const template of templates) {
      specs.push({
        ...generateRandomSpec(category),
        ...template,
        category,
      } as SeedSpec)
    }
  }

  // Fill remaining with random specs
  while (specs.length < count) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    specs.push(generateRandomSpec(category))
  }

  // Shuffle and take count
  const shuffled = specs.sort(() => Math.random() - 0.5).slice(0, count)

  // Generate and save
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < shuffled.length; i++) {
    const spec = shuffled[i]
    const success = await generateAndSaveSpec(spec, userId)
    
    if (success) {
      successCount++
    } else {
      failCount++
    }

    // Rate limiting - wait between requests
    if (i < shuffled.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
    }

    // Progress update
    if ((i + 1) % 10 === 0) {
      console.log(`\nProgress: ${i + 1}/${shuffled.length} (${successCount} success, ${failCount} failed)\n`)
    }
  }

  console.log(`\n✅ Seeding complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`   Total: ${shuffled.length}\n`)
}

// CLI interface
const args = process.argv.slice(2)
const countArg = args.find(arg => arg.startsWith('--count='))
const categoryArg = args.find(arg => arg.startsWith('--category='))

const options: { count?: number; category?: SpecCategory } = {}

if (countArg) {
  options.count = parseInt(countArg.split('=')[1])
}

if (categoryArg) {
  const category = categoryArg.split('=')[1] as SpecCategory
  if (CATEGORIES.some(c => c.value === category)) {
    options.category = category
  }
}

seedSpecs(options)
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

