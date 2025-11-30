import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get single spec
      const { data: spec, error } = await supabase
        .from('specs')
        .select(`
          *,
          profile:profiles!specs_created_by_fkey (
            id,
            username,
            display_name,
            acidentiton_seed
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if user has upvoted
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: upvote } = await supabase
          .from('upvotes')
          .select('spec_id')
          .eq('user_id', user.id)
          .eq('spec_id', id)
          .single()

        spec.has_upvoted = !!upvote
      }

      return NextResponse.json(spec)
    }

    return NextResponse.json({ error: 'Spec ID required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching spec:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spec' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, spec_type, content, category, difficulty, tags, vibe, is_public } =
      body

    if (!title || !content || !category || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: spec, error } = await supabase
      .from('specs')
      .insert({
        created_by: user.id,
        title,
        description,
        spec_type: spec_type || 'markdown',
        content,
        category,
        difficulty,
        tags: tags || [],
        vibe: vibe || null,
        is_public: is_public !== false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(spec)
  } catch (error) {
    console.error('Error creating spec:', error)
    return NextResponse.json(
      { error: 'Failed to create spec' },
      { status: 500 }
    )
  }
}

