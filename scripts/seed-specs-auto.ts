/**
 * Auto-Seed Script - Creates system user and generates specs
 * 
 * This version automatically creates a system user via Supabase Admin API
 * Requires SUPABASE_SERVICE_ROLE_KEY with admin privileges
 */

import { createClient } from '@supabase/supabase-js'
import { generateSpec } from '../lib/deepseek/client'
import { SpecCategory } from '../lib/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Curated specs (same as seed-specs-simple.ts)
const CURATED_SPECS = [
  {
    title: 'SaaS Product Landing Page',
    description: 'A conversion-optimized landing page for a SaaS product with hero, features, pricing, testimonials, and strong CTAs.',
    category: 'landing-page' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'modern',
    pages: ['Home', 'Features', 'Pricing', 'Testimonials', 'FAQ'],
    features: ['Hero Section', 'Feature Grid', 'Pricing Tiers', 'Social Proof', 'Email Capture'],
    tags: ['saas', 'landing-page', 'conversion'],
  },
  {
    title: 'Creative Agency Portfolio',
    description: 'A stunning portfolio website for a creative agency showcasing projects, team, and services with beautiful animations.',
    category: 'portfolio' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'playful',
    pages: ['Home', 'Work', 'Services', 'Team', 'Contact'],
    features: ['Project Gallery', 'Case Studies', 'Team Profiles', 'Contact Form', 'Blog'],
    tags: ['portfolio', 'agency', 'creative'],
  },
  {
    title: 'E-commerce Product Launch',
    description: 'A high-converting product launch page with video hero, feature showcase, reviews, and pre-order functionality.',
    category: 'e-commerce' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'bold',
    pages: ['Home', 'Product', 'Features', 'Reviews', 'Pre-order'],
    features: ['Video Hero', 'Product Showcase', 'Social Proof', 'Pre-order System', 'Email Notifications'],
    tags: ['ecommerce', 'product', 'launch'],
  },
  {
    title: 'Analytics Dashboard',
    description: 'A comprehensive analytics dashboard with real-time metrics, interactive charts, custom reports, and data export.',
    category: 'saas-dashboard' as SpecCategory,
    difficulty: 'enterprise' as const,
    vibe: 'corporate',
    pages: ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Export'],
    features: ['Real-time Metrics', 'Interactive Charts', 'Custom Reports', 'Data Export', 'Alerts'],
    tags: ['analytics', 'dashboard', 'data'],
  },
  {
    title: 'Project Management Dashboard',
    description: 'A project management dashboard with task tracking, team collaboration, timeline views, and notifications.',
    category: 'saas-dashboard' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'modern',
    pages: ['Dashboard', 'Projects', 'Tasks', 'Team', 'Calendar', 'Reports'],
    features: ['Task Management', 'Team Collaboration', 'Timeline View', 'Notifications', 'File Sharing'],
    tags: ['project-management', 'collaboration', 'tasks'],
  },
  {
    title: 'CRM Dashboard',
    description: 'A customer relationship management dashboard with contact management, sales pipeline, and activity tracking.',
    category: 'saas-dashboard' as SpecCategory,
    difficulty: 'enterprise' as const,
    vibe: 'corporate',
    pages: ['Dashboard', 'Contacts', 'Deals', 'Analytics', 'Settings'],
    features: ['Contact Management', 'Sales Pipeline', 'Email Integration', 'Activity Tracking', 'Reports'],
    tags: ['crm', 'sales', 'contacts'],
  },
  {
    title: 'REST API Documentation',
    description: 'Comprehensive REST API documentation with interactive explorer, authentication guide, endpoints, and code examples.',
    category: 'api-docs' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'minimal',
    pages: ['Overview', 'Authentication', 'Endpoints', 'Examples', 'SDKs', 'Changelog'],
    features: ['Interactive API Explorer', 'Code Examples', 'SDK Documentation', 'Rate Limits', 'Error Handling'],
    tags: ['api', 'rest', 'documentation'],
  },
  {
    title: 'GraphQL API Reference',
    description: 'Complete GraphQL API reference with schema explorer, queries, mutations, subscriptions, and type definitions.',
    category: 'api-docs' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'modern',
    pages: ['Getting Started', 'Schema', 'Queries', 'Mutations', 'Subscriptions'],
    features: ['GraphQL Playground', 'Schema Explorer', 'Code Examples', 'Type Definitions', 'Best Practices'],
    tags: ['graphql', 'api', 'reference'],
  },
  {
    title: 'Modern E-commerce Store',
    description: 'A full-featured e-commerce store with product catalog, shopping cart, secure checkout, and user accounts.',
    category: 'e-commerce' as SpecCategory,
    difficulty: 'enterprise' as const,
    vibe: 'modern',
    pages: ['Home', 'Shop', 'Product', 'Cart', 'Checkout', 'Account', 'Orders'],
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'User Accounts', 'Order Tracking', 'Reviews'],
    tags: ['ecommerce', 'shop', 'products'],
  },
  {
    title: 'Modern Blog Platform',
    description: 'A feature-rich blog platform with categories, tags, search, author profiles, comments, and newsletter.',
    category: 'blog' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'elegant',
    pages: ['Home', 'Posts', 'Categories', 'Authors', 'About', 'Contact'],
    features: ['Post Categories', 'Tag System', 'Search', 'Author Profiles', 'Comments', 'Newsletter'],
    tags: ['blog', 'content', 'cms'],
  },
  {
    title: 'Admin Dashboard',
    description: 'A comprehensive admin panel for managing users, content, system settings, and viewing analytics.',
    category: 'admin-panel' as SpecCategory,
    difficulty: 'enterprise' as const,
    vibe: 'corporate',
    pages: ['Dashboard', 'Users', 'Content', 'Settings', 'Analytics', 'Logs'],
    features: ['User Management', 'Content Management', 'System Settings', 'Activity Logs', 'Permissions'],
    tags: ['admin', 'management', 'dashboard'],
  },
  {
    title: 'Marketing Website',
    description: 'A marketing website with landing pages, blog, resource library, lead generation forms, and contact system.',
    category: 'marketing-site' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'bold',
    pages: ['Home', 'About', 'Services', 'Blog', 'Resources', 'Contact'],
    features: ['Lead Generation', 'Resource Library', 'Blog', 'Contact Forms', 'Newsletter'],
    tags: ['marketing', 'lead-gen', 'content'],
  },
  {
    title: 'Product Documentation',
    description: 'Comprehensive product documentation with getting started guides, tutorials, API reference, and FAQ.',
    category: 'documentation' as SpecCategory,
    difficulty: 'production' as const,
    vibe: 'minimal',
    pages: ['Getting Started', 'Guides', 'Tutorials', 'API Reference', 'FAQ', 'Changelog'],
    features: ['Search', 'Code Examples', 'Interactive Tutorials', 'Version History', 'Feedback'],
    tags: ['docs', 'product', 'reference'],
  },
]

async function createSystemUser() {
  // Check if system user already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'vibecherry')
    .single()

  if (existing) {
    console.log('✅ System user already exists')
    return existing.id
  }

  // Try to use environment variable first
  const systemUserId = process.env.SYSTEM_USER_ID
  
  if (systemUserId) {
    // Check if profile exists for this ID
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', systemUserId)
      .single()
    
    if (existing) {
      console.log('✅ Using system user from SYSTEM_USER_ID')
      return systemUserId
    }
    
    // Try to create profile for provided ID
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: systemUserId,
        username: 'vibecherry',
        display_name: 'VibeCherry',
        acidentiton_seed: 'vibecherry-system',
        is_pro: true,
      })
    
    if (!profileError) {
      console.log('✅ Created system user profile')
      return systemUserId
    }
  }

  // If no system user, provide instructions
  console.error('\n❌ System user not found!')
  console.error('\nPlease create a system user:')
  console.error('1. Go to Supabase Dashboard > Authentication > Users')
  console.error('2. Click "Add User"')
  console.error('3. Create user with email: system@vibecherry.local')
  console.error('4. Copy the User ID')
  console.error('5. Set environment variable: export SYSTEM_USER_ID=your-user-id')
  console.error('6. Or run SQL in scripts/create-system-user.sql\n')
  throw new Error('System user required. See instructions above.')
}

async function generateAndSaveSpec(spec: typeof CURATED_SPECS[0], userId: string) {
  try {
    console.log(`Generating: ${spec.title}...`)

    const content = await generateSpec({
      title: spec.title,
      description: spec.description,
      category: spec.category,
      specType: 'markdown',
      vibe: spec.vibe,
      features: spec.features,
      pages: spec.pages,
    })

    const { error } = await supabase
      .from('specs')
      .insert({
        created_by: userId,
        title: spec.title,
        description: spec.description,
        spec_type: 'markdown',
        content,
        category: spec.category,
        difficulty: spec.difficulty,
        tags: spec.tags,
        vibe: spec.vibe,
        is_public: true,
        is_featured: Math.random() > 0.5,
      })

    if (error) {
      console.error(`❌ Error: ${spec.title} - ${error.message}`)
      return false
    }

    console.log(`✅ Created: ${spec.title}`)
    return true
  } catch (error) {
    console.error(`❌ Error generating ${spec.title}:`, error)
    return false
  }
}

async function seedSpecs() {
  console.log(`\n🍒 VibeCherry - Auto Seeding`)
  console.log(`Generating ${CURATED_SPECS.length} high-quality specs...\n`)

  const userId = await createSystemUser()
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < CURATED_SPECS.length; i++) {
    const spec = CURATED_SPECS[i]
    const success = await generateAndSaveSpec(spec, userId)
    
    if (success) {
      successCount++
    } else {
      failCount++
    }

    // Rate limiting
    if (i < CURATED_SPECS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    console.log(`Progress: ${i + 1}/${CURATED_SPECS.length}\n`)
  }

  console.log(`\n✅ Seeding complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`   Total: ${CURATED_SPECS.length}\n`)
}

seedSpecs()
  .then(() => {
    console.log('Done! 🎉')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

