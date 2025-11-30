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

    const { collection_id, spec_id } = await request.json()

    if (!collection_id || !spec_id) {
      return NextResponse.json(
        { error: 'Collection ID and Spec ID required' },
        { status: 400 }
      )
    }

    // Verify collection ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('created_by')
      .eq('id', collection_id)
      .single()

    if (!collection || collection.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if already in collection
    const { data: existing } = await supabase
      .from('collection_specs')
      .select('*')
      .eq('collection_id', collection_id)
      .eq('spec_id', spec_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Spec already in collection' }, { status: 400 })
    }

    const { error } = await supabase.from('collection_specs').insert({
      collection_id,
      spec_id,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding spec to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add spec to collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const collection_id = searchParams.get('collection_id')
    const spec_id = searchParams.get('spec_id')

    if (!collection_id || !spec_id) {
      return NextResponse.json(
        { error: 'Collection ID and Spec ID required' },
        { status: 400 }
      )
    }

    // Verify collection ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('created_by')
      .eq('id', collection_id)
      .single()

    if (!collection || collection.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('collection_specs')
      .delete()
      .eq('collection_id', collection_id)
      .eq('spec_id', spec_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing spec from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove spec from collection' },
      { status: 500 }
    )
  }
}

