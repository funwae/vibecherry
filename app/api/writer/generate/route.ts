import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSpec } from '@/lib/deepseek/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('specs_generated_this_month, is_pro')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const freeLimit = parseInt(process.env.FREE_SPECS_PER_MONTH || '5')
    if (!profile.is_pro && profile.specs_generated_this_month >= freeLimit) {
      return NextResponse.json(
        { error: 'Monthly spec limit reached. Upgrade to Pro for unlimited generation.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { title, description, category, specType, vibe, features, pages } = body

    if (!title || !description || !category || !specType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, specType' },
        { status: 400 }
      )
    }

    // Generate spec using DeepSeek
    const spec = await generateSpec({
      title,
      description,
      category,
      specType,
      vibe,
      features,
      pages
    })

    // Increment usage counter
    await supabase
      .from('profiles')
      .update({ 
        specs_generated_this_month: profile.specs_generated_this_month + 1 
      })
      .eq('id', user.id)

    return NextResponse.json({
      spec,
      remaining: profile.is_pro 
        ? -1 // Unlimited
        : freeLimit - profile.specs_generated_this_month - 1
    })
  } catch (error) {
    console.error('Error generating spec:', error)
    return NextResponse.json(
      { error: 'Failed to generate spec' },
      { status: 500 }
    )
  }
}
