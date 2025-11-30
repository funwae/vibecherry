import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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
    const id = searchParams.get('id')

    if (id) {
      // Get single collection with specs
      const { data: collection, error } = await supabase
        .from('collections')
        .select(
          `
          *,
          profile:profiles!collections_created_by_fkey (
            id,
            username,
            display_name
          )
        `
        )
        .eq('id', id)
        .single()

      if (error) throw error

      // Get specs in collection
      const { data: collectionSpecs } = await supabase
        .from('collection_specs')
        .select(
          `
          spec:specs (
            *,
            profile:profiles!specs_created_by_fkey (
              id,
              username,
              display_name,
              acidentiton_seed
            )
          )
        `
        )
        .eq('collection_id', id)
        .order('added_at', { ascending: false })

      return NextResponse.json({
        ...collection,
        specs: collectionSpecs?.map((cs: any) => cs.spec) || [],
      })
    }

    // Get user's collections
    const { data: collections, error } = await supabase
      .from('collections')
      .select(
        `
        *,
        profile:profiles!collections_created_by_fkey (
          id,
          username,
          display_name
        )
      `
      )
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get spec counts
    const collectionsWithCounts = await Promise.all(
      (collections || []).map(async (collection) => {
        const { count } = await supabase
          .from('collection_specs')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collection.id)

        return {
          ...collection,
          spec_count: count || 0,
        }
      })
    )

    return NextResponse.json(collectionsWithCounts)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
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
    const { name, description, is_public, spec_id } = body

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 })
    }

    // Create collection
    const { data: collection, error } = await supabase
      .from('collections')
      .insert({
        created_by: user.id,
        name,
        description,
        is_public: is_public !== false,
      })
      .select()
      .single()

    if (error) throw error

    // If spec_id provided, add it to collection
    if (spec_id) {
      await supabase.from('collection_specs').insert({
        collection_id: collection.id,
        spec_id,
      })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Collection ID required' }, { status: 400 })
    }

    // Verify ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!collection || collection.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('collections').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}

