import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables not configured');
    }

    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
}

const API_KEY = process.env.STORIES_API_KEY;

function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === API_KEY;
}

// GET /api/stories/[id] - Get single story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getSupabase();
    const { id } = await params;

    const { data, error } = await db
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ story: data });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }
}

// PATCH /api/stories/[id] - Update story
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getSupabase();
    const { id } = await params;
    const body = await request.json();

    // Map camelCase to snake_case for database
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.imageCaption !== undefined) updateData.image_caption = body.imageCaption;
    if (body.image_caption !== undefined) updateData.image_caption = body.image_caption;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status !== undefined) updateData.status = body.status;

    const { data, error } = await db
      .from('stories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, story: data });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Invalid request body or database not configured' },
      { status: 400 }
    );
  }
}

// DELETE /api/stories/[id] - Delete story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getSupabase();
    const { id } = await params;

    const { error } = await db
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }
}
