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

// Simple API key authentication for n8n
const API_KEY = process.env.STORIES_API_KEY;

function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === API_KEY;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/stories - List all stories
export async function GET(request: NextRequest) {
  try {
    const db = getSupabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stories: data });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }
}

// POST /api/stories - Create a new story (requires API key)
export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getSupabase();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'author', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate category
    const validCategories = ['News', 'Reviews', 'Auctions', 'Heritage', 'Motorsport', 'Collecting'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title);

    // Check for duplicate slug
    const { data: existing } = await db
      .from('stories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      // Append timestamp to make unique
      const uniqueSlug = `${slug}-${Date.now()}`;
      body.slug = uniqueSlug;
    } else {
      body.slug = slug;
    }

    // Prepare story data
    const storyData = {
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle || null,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      category: body.category,
      tags: body.tags || [],
      image_url: body.image_url || body.imageUrl || null,
      image_caption: body.image_caption || body.imageCaption || null,
      featured: body.featured || false,
      status: body.status || 'published', // Default to published for automation
      source_url: body.source_url || body.sourceUrl || null,
      source_name: body.source_name || body.sourceName || null,
      published_at: body.published_at || new Date().toISOString(),
    };

    const { data, error } = await db
      .from('stories')
      .insert([storyData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, story: data }, { status: 201 });
  } catch (err) {
    console.error('Error creating story:', err);
    return NextResponse.json(
      { error: 'Invalid request body or database not configured' },
      { status: 400 }
    );
  }
}
