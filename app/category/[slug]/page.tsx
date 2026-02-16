'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStories } from '@/lib/stories-context';
import { CATEGORIES, StoryCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const categoryDescriptions: Record<string, string> = {
  news: 'Breaking developments from the world of exotic automobiles, delivered with the gravitas they deserve.',
  reviews: 'Candid assessments of the finest machines ever to grace tarmac, written by those who understand.',
  auctions: 'Coverage of significant sales and market movements in the collector car world.',
  heritage: 'Exploring the lineage and provenance of automotive excellence.',
  motorsport: 'Historic and contemporary racing coverage for the discerning enthusiast.',
  collecting: 'Insights and analysis for the serious automotive collector.',
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { getStoriesByCategory } = useStories();

  // Find the matching category (case-insensitive)
  const category = CATEGORIES.find(
    (c) => c.toLowerCase() === resolvedParams.slug.toLowerCase()
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white">
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
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="vintage-heading text-4xl mb-4">Category Not Found</h1>
          <p className="text-white/60 mb-8">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-white/90">
              Return to Homepage
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const stories = getStoriesByCategory(category);

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
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className={`text-sm transition-colors tracking-wide uppercase ${
                    cat === category
                      ? 'text-white racing-accent'
                      : 'text-white/70 hover:text-white racing-accent-hover'
                  }`}
                >
                  {cat}
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
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className={`text-xs transition-colors tracking-wide uppercase whitespace-nowrap ${
                cat === category ? 'text-white racing-accent' : 'text-white/70 hover:text-white racing-accent-hover'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mechanical-pattern">
        {/* Category Header */}
        <section className="border-b border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-4">
                Category
              </p>
              <h1 className="vintage-heading text-4xl md:text-5xl mb-4">{category}</h1>
              <p className="text-xl text-white/60">
                {categoryDescriptions[category.toLowerCase()]}
              </p>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {stories.length > 0 ? (
              <>
                <p className="text-sm text-white/50 mb-8">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stories.map((story) => (
                    <Link
                      key={story.id}
                      href={`/story/${story.slug}`}
                      className="group luxury-card block p-4 -m-4"
                    >
                      <div className="aspect-[16/10] bg-white/5 mb-4 overflow-hidden">
                        {story.imageUrl ? (
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                            <span className="text-white/30 text-xs tracking-widest uppercase">
                              {story.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-white/40">{formatDate(story.publishedAt)}</span>
                        </div>
                        <h3 className="vintage-heading text-xl leading-snug group-hover:text-white/80 transition-colors">
                          {story.title}
                        </h3>
                        {story.subtitle && (
                          <p className="text-white/50 text-sm">{story.subtitle}</p>
                        )}
                        <p className="text-white/60 text-sm line-clamp-2">{story.excerpt}</p>
                        <p className="text-xs text-white/40">By {story.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/50 mb-4">No stories in this category yet.</p>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Browse All Stories
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Other Categories */}
        <section className="border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="vintage-heading text-2xl mb-6">Other Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES.filter((c) => c !== category).map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="group block p-4 border border-white/10 hover:border-white/30 transition-colors text-center"
                >
                  <h3 className="vintage-heading text-lg group-hover:text-white/80 transition-colors">
                    {cat}
                  </h3>
                </Link>
              ))}
            </div>
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
