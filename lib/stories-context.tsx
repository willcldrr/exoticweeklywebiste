'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Story, StoryCategory } from './types';
import { mockStories } from './mock-stories';
import * as db from './supabase';
import { isSupabaseConfigured } from './supabase';

interface StoriesContextType {
  stories: Story[];
  loading: boolean;
  error: string | null;
  addStory: (story: Omit<Story, 'id'>) => Promise<void>;
  updateStory: (id: string, story: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  refreshStories: () => Promise<void>;
  getStoryBySlug: (slug: string) => Story | undefined;
  getStoryById: (id: string) => Story | undefined;
  getFeaturedStories: () => Story[];
  getPublishedStories: () => Story[];
  getStoriesByCategory: (category: StoryCategory) => Story[];
  getLatestStories: (count?: number) => Story[];
  useSupabase: boolean;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

const STORAGE_KEY = 'exotics-weekly-stories';

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSupabase, setUseSupabase] = useState(false);

  // Check Supabase config on client-side only
  useEffect(() => {
    setUseSupabase(isSupabaseConfigured());
  }, []);

  // Fetch stories from Supabase or localStorage
  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useSupabase) {
        const data = await db.fetchAllStories();
        setStories(data);
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setStories(JSON.parse(stored));
          } catch {
            setStories(mockStories);
          }
        } else {
          setStories(mockStories);
        }
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      // Fallback to mock data on error
      setStories(mockStories);
    } finally {
      setLoading(false);
    }
  }, [useSupabase]);

  // Initial fetch
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Save to localStorage when not using Supabase
  useEffect(() => {
    if (!useSupabase && !loading && stories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    }
  }, [stories, loading, useSupabase]);

  const addStory = async (storyData: Omit<Story, 'id'>) => {
    if (useSupabase) {
      const newStory = await db.createStory(storyData);
      if (newStory) {
        setStories((prev) => [newStory, ...prev]);
      }
    } else {
      const newStory: Story = {
        ...storyData,
        id: Date.now().toString(),
      };
      setStories((prev) => [newStory, ...prev]);
    }
  };

  const updateStory = async (id: string, updates: Partial<Story>) => {
    if (useSupabase) {
      const updated = await db.updateStory(id, updates);
      if (updated) {
        setStories((prev) =>
          prev.map((story) => (story.id === id ? updated : story))
        );
      }
    } else {
      setStories((prev) =>
        prev.map((story) =>
          story.id === id
            ? { ...story, ...updates, updatedAt: new Date().toISOString() }
            : story
        )
      );
    }
  };

  const deleteStory = async (id: string) => {
    if (useSupabase) {
      const success = await db.deleteStory(id);
      if (success) {
        setStories((prev) => prev.filter((story) => story.id !== id));
      }
    } else {
      setStories((prev) => prev.filter((story) => story.id !== id));
    }
  };

  const refreshStories = async () => {
    await fetchStories();
  };

  const getStoryBySlug = (slug: string) => {
    return stories.find((story) => story.slug === slug);
  };

  const getStoryById = (id: string) => {
    return stories.find((story) => story.id === id);
  };

  const getFeaturedStories = () => {
    return stories.filter((story) => story.featured && story.status === 'published');
  };

  const getPublishedStories = () => {
    return stories.filter((story) => story.status === 'published');
  };

  const getStoriesByCategory = (category: StoryCategory) => {
    return stories.filter(
      (story) => story.category === category && story.status === 'published'
    );
  };

  const getLatestStories = (count: number = 6) => {
    return getPublishedStories()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, count);
  };

  return (
    <StoriesContext.Provider
      value={{
        stories,
        loading,
        error,
        addStory,
        updateStory,
        deleteStory,
        refreshStories,
        getStoryBySlug,
        getStoryById,
        getFeaturedStories,
        getPublishedStories,
        getStoriesByCategory,
        getLatestStories,
        useSupabase,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
}
