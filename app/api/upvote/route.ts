import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const { spec_id } = await request.json()

    if (!spec_id) {
      return NextResponse.json({ error: 'Spec ID required' }, { status: 400 })
    }

    // Check if already upvoted
    const { data: existing } = await supabase
      .from('upvotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('spec_id', spec_id)
      .single()

    if (existing) {
      // Remove upvote
      await supabase.from('upvotes').delete().eq('user_id', user.id).eq('spec_id', spec_id)

      // Decrement count
      const { data: spec } = await supabase
        .from('specs')
        .select('upvote_count')
        .eq('id', spec_id)
        .single()

      if (spec) {
        await supabase
          .from('specs')
          .update({ upvote_count: Math.max(0, spec.upvote_count - 1) })
          .eq('id', spec_id)
      }

      return NextResponse.json({ upvoted: false })
    } else {
      // Add upvote
      await supabase.from('upvotes').insert({
        user_id: user.id,
        spec_id,
      })

      // Increment count
      const { data: spec } = await supabase
        .from('specs')
        .select('upvote_count')
        .eq('id', spec_id)
        .single()

      if (spec) {
        await supabase
          .from('specs')
          .update({ upvote_count: spec.upvote_count + 1 })
          .eq('id', spec_id)
      }

      return NextResponse.json({ upvoted: true })
    }
  } catch (error) {
    console.error('Error toggling upvote:', error)
    return NextResponse.json(
      { error: 'Failed to toggle upvote' },
      { status: 500 }
    )
  }
}

