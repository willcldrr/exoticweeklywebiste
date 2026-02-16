'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStories } from '@/lib/stories-context';
import { CATEGORIES, StoryCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArchivePage() {
  const { getPublishedStories } = useStories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'all'>('all');

  const allStories = getPublishedStories();

  const filteredStories = allStories
    .filter((story) => {
      if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          story.title.toLowerCase().includes(query) ||
          story.excerpt.toLowerCase().includes(query) ||
          story.author.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Group stories by month/year
  const groupedStories = filteredStories.reduce((acc, story) => {
    const date = new Date(story.publishedAt);
    const key = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(story);
    return acc;
  }, {} as Record<string, typeof filteredStories>);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/exotics-weekly-header-logo.png"
                alt="Exotics Weekly"
                width={320}
                height={80}
                className="h-14 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="text-sm text-white/70 hover:text-white racing-accent-hover transition-colors tracking-wide uppercase"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {/* Racing Stripe Accent */}
        <div className="racing-stripe" />
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-white/10 overflow-x-auto">
        <div className="flex items-center gap-6 px-4 py-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="text-xs text-white/70 hover:text-white racing-accent-hover transition-colors tracking-wide uppercase whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mechanical-pattern">
        {/* Archive Header */}
        <section className="border-b border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="vintage-heading text-4xl md:text-5xl mb-4">Archive</h1>
              <p className="text-xl text-white/60">
                A complete record of our automotive journalism, organized chronologically.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Input
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/20 text-white max-w-xs"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className={
                    selectedCategory === 'all'
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }
                  size="sm"
                >
                  All
                </Button>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      selectedCategory === cat
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Archive Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredStories.length > 0 ? (
              <>
                <p className="text-sm text-white/50 mb-8">
                  {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
                </p>

                {Object.entries(groupedStories).map(([monthYear, stories]) => (
                  <div key={monthYear} className="mb-12">
                    <h2 className="vintage-heading text-xl mb-6 pb-4 border-b border-white/10">
                      {monthYear}
                    </h2>
                    <div className="space-y-6">
                      {stories.map((story) => (
                        <Link
                          key={story.id}
                          href={`/story/${story.slug}`}
                          className="group block"
                        >
                          <div className="grid md:grid-cols-4 gap-4 py-4 border-b border-white/5 hover:bg-white/5 -mx-4 px-4 transition-colors">
                            <div className="md:col-span-3">
                              <div className="flex items-center gap-2 text-xs mb-2">
                                <span className="text-white/50 uppercase tracking-widest">
                                  {story.category}
                                </span>
                                <span className="text-white/30">·</span>
                                <span className="text-white/40">
                                  {formatDate(story.publishedAt)}
                                </span>
                              </div>
                              <h3 className="vintage-heading text-lg mb-2 group-hover:text-white/80 transition-colors">
                                {story.title}
                              </h3>
                              <p className="text-white/60 text-sm line-clamp-2">
                                {story.excerpt}
                              </p>
                            </div>
                            <div className="hidden md:flex items-center justify-end">
                              <span className="text-xs text-white/40">
                                By {story.author}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/50 mb-4">No stories match your search.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Racing Stripe Before Footer */}
      <div className="racing-stripe" />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative footer-cog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Image
              src="/images/exotics-weekly-header-logo.png"
              alt="Exotics Weekly"
              width={160}
              height={40}
              className="h-8 w-auto"
            />
            <div className="flex items-center gap-6">
              <p className="text-white/40 text-xs">
                © {new Date().getFullYear()} Exotics Weekly. All rights reserved.
              </p>
              <Link
                href="/admin"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
