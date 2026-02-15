import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Story } from './types';

// Lazy initialization to avoid build-time errors
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

// Export for checking if configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Database helper functions
export async function fetchAllStories(): Promise<Story[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching stories:', error);
    return [];
  }

  return (data || []).map(mapDbToStory);
}

export async function fetchPublishedStories(): Promise<Story[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('stories')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published stories:', error);
    return [];
  }

  return (data || []).map(mapDbToStory);
}

export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching story:', error);
    return null;
  }

  return data ? mapDbToStory(data) : null;
}

export async function fetchStoriesByCategory(category: string): Promise<Story[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('stories')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching stories by category:', error);
    return [];
  }

  return (data || []).map(mapDbToStory);
}

export async function fetchFeaturedStories(): Promise<Story[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('stories')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured stories:', error);
    return [];
  }

  return (data || []).map(mapDbToStory);
}

export async function createStory(story: Omit<Story, 'id'>): Promise<Story | null> {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('stories')
    .insert([mapStoryToDb(story)])
    .select()
    .single();

  if (error) {
    console.error('Error creating story:', error);
    return null;
  }

  return data ? mapDbToStory(data) : null;
}

export async function updateStory(id: string, updates: Partial<Story>): Promise<Story | null> {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('stories')
    .update(mapStoryToDb(updates))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating story:', error);
    return null;
  }

  return data ? mapDbToStory(data) : null;
}

export async function deleteStory(id: string): Promise<boolean> {
  const db = getSupabase();
  if (!db) return false;

  const { error } = await db
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting story:', error);
    return false;
  }

  return true;
}

// Map database row to Story type (snake_case to camelCase)
function mapDbToStory(row: Record<string, unknown>): Story {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string | undefined,
    excerpt: row.excerpt as string,
    content: row.content as string,
    author: row.author as string,
    category: row.category as Story['category'],
    tags: row.tags as string[],
    imageUrl: row.image_url as string,
    imageCaption: row.image_caption as string | undefined,
    publishedAt: row.published_at as string,
    updatedAt: row.updated_at as string | undefined,
    featured: row.featured as boolean,
    status: row.status as Story['status'],
  };
}

// Map Story to database format (camelCase to snake_case)
function mapStoryToDb(story: Partial<Story>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  if (story.slug !== undefined) mapped.slug = story.slug;
  if (story.title !== undefined) mapped.title = story.title;
  if (story.subtitle !== undefined) mapped.subtitle = story.subtitle;
  if (story.excerpt !== undefined) mapped.excerpt = story.excerpt;
  if (story.content !== undefined) mapped.content = story.content;
  if (story.author !== undefined) mapped.author = story.author;
  if (story.category !== undefined) mapped.category = story.category;
  if (story.tags !== undefined) mapped.tags = story.tags;
  if (story.imageUrl !== undefined) mapped.image_url = story.imageUrl;
  if (story.imageCaption !== undefined) mapped.image_caption = story.imageCaption;
  if (story.publishedAt !== undefined) mapped.published_at = story.publishedAt;
  if (story.updatedAt !== undefined) mapped.updated_at = story.updatedAt;
  if (story.featured !== undefined) mapped.featured = story.featured;
  if (story.status !== undefined) mapped.status = story.status;

  return mapped;
}
