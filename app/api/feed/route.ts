import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const vibe = searchParams.get('vibe')
    const tags = searchParams.get('tags')?.split(',')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'recent'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const featured = searchParams.get('featured') === 'true'
    const created_by = searchParams.get('created_by')

    // Build query
    let query = supabase
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
      .eq('is_public', true)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    if (vibe) {
      query = query.eq('vibe', vibe)
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (created_by) {
      query = query.eq('created_by', created_by)
    }

    // Text search
    if (search) {
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english',
      })
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query = query.order('upvote_count', { ascending: false })
        break
      case 'downloads':
        query = query.order('download_count', { ascending: false })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: specs, error } = await query

    if (error) {
      throw error
    }

    // Get upvote status for authenticated users
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && specs) {
      const specIds = specs.map((s) => s.id)
      const { data: upvotes } = await supabase
        .from('upvotes')
        .select('spec_id')
        .eq('user_id', user.id)
        .in('spec_id', specIds)

      const upvotedIds = new Set(upvotes?.map((u) => u.spec_id) || [])

      specs.forEach((spec) => {
        spec.has_upvoted = upvotedIds.has(spec.id)
      })
    }

    return NextResponse.json({
      specs: specs || [],
      count: specs?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specs' },
      { status: 500 }
    )
  }
}

