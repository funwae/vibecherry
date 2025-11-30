// Database types
export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  acidentiton_seed: string
  acidentiton_colors: AcidentitonColors | null
  created_at: string
  updated_at: string
  specs_generated_this_month: number
  is_pro: boolean
  pro_expires_at: string | null
}

export interface Spec {
  id: string
  created_by: string
  title: string
  description: string | null
  spec_type: 'markdown' | 'json'
  content: string
  category: SpecCategory
  difficulty: SpecDifficulty
  tags: string[]
  vibe: string | null
  upvote_count: number
  download_count: number
  remix_count: number
  is_public: boolean
  is_featured: boolean
  screenshot_url: string | null
  screenshot_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  
  // Joined data
  profile?: Profile
  has_upvoted?: boolean
}

export interface Collection {
  id: string
  created_by: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  
  // Joined data
  profile?: Profile
  spec_count?: number
  specs?: Spec[]
}

export interface Upvote {
  user_id: string
  spec_id: string
  created_at: string
}

export interface Render {
  id: string
  spec_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  attempts: number
  max_attempts: number
  created_at: string
  updated_at: string
  completed_at: string | null
}

// Enums
export type SpecCategory = 
  | 'landing-page'
  | 'saas-dashboard'
  | 'api-docs'
  | 'portfolio'
  | 'e-commerce'
  | 'blog'
  | 'admin-panel'
  | 'marketing-site'
  | 'documentation'
  | 'other'

export type SpecDifficulty = 'weekend' | 'production' | 'enterprise'

export const CATEGORIES: { value: SpecCategory; label: string }[] = [
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'saas-dashboard', label: 'SaaS Dashboard' },
  { value: 'api-docs', label: 'API Documentation' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'admin-panel', label: 'Admin Panel' },
  { value: 'marketing-site', label: 'Marketing Site' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' },
]

export const DIFFICULTIES: { value: SpecDifficulty; label: string; description: string }[] = [
  { value: 'weekend', label: 'Weekend Project', description: 'Build in a few hours' },
  { value: 'production', label: 'Production Ready', description: 'Full-featured application' },
  { value: 'enterprise', label: 'Enterprise', description: 'Complex system' },
]

export const VIBES = [
  'minimal',
  'playful',
  'corporate',
  'experimental',
  'retro',
  'modern',
  'elegant',
  'bold',
]

// Acidentiton types
export interface AcidentitonColors {
  primary: string
  secondary: string
  background: string
}

// API types
export interface GenerateSpecRequest {
  title: string
  description: string
  category: SpecCategory
  specType: 'markdown' | 'json'
  vibe?: string
  features?: string[]
  pages?: string[]
}

export interface GenerateSpecResponse {
  spec: string
  remaining: number // -1 for unlimited (pro users)
}

// Writer flow types
export interface WriterState {
  step: number
  title: string
  description: string
  category: SpecCategory | null
  specType: 'markdown' | 'json'
  vibe: string
  features: string[]
  pages: string[]
  difficulty: SpecDifficulty | null
  tags: string[]
}
