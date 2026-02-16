'use client';

import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStories } from '@/lib/stories-context';
import { CATEGORIES } from '@/lib/types';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://willcldrr.app.n8n.cloud/webhook/add-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Welcome to Exotics Weekly.');
        setEmail('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="vintage-heading text-3xl md:text-4xl mb-4">
          The Weekly Dispatch
        </h2>
        <p className="text-white/70 mb-8 text-lg">
          The only automotive newsletter that understands the difference between fast and extraordinary.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 bg-white text-black hover:bg-white/90 font-medium tracking-wide"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        {message && <p className="mt-4 text-white/70 text-sm">{message}</p>}
      </div>
    </section>
  );
}

export default function Home() {
  const { getFeaturedStories, getLatestStories, getStoriesByCategory } = useStories();

  const featuredStories = getFeaturedStories();
  const latestStories = getLatestStories(6);
  const heroStory = featuredStories[0] || latestStories[0];
  const secondaryFeatured = featuredStories[1] || latestStories[1];
  const remainingStories = latestStories.filter(
    (s) => s.id !== heroStory?.id && s.id !== secondaryFeatured?.id
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
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
                  className="text-sm text-white/70 hover:text-white transition-colors tracking-wide uppercase"
                >
                  {category}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-white/10 overflow-x-auto">
        <div className="flex items-center gap-6 px-4 py-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="text-xs text-white/70 hover:text-white transition-colors tracking-wide uppercase whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        {heroStory && (
          <section className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Hero Story */}
                <div className="lg:col-span-2">
                  <Link href={`/story/${heroStory.slug}`} className="group block">
                    <div className="aspect-[16/9] bg-white/5 mb-6 overflow-hidden">
                      {heroStory.imageUrl ? (
                        <img
                          src={heroStory.imageUrl}
                          alt={heroStory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                          <span className="text-white/30 text-sm tracking-widest uppercase">
                            {heroStory.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-white/50 uppercase tracking-widest text-xs">
                          {heroStory.category}
                        </span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/50">{formatDate(heroStory.publishedAt)}</span>
                      </div>
                      <h1 className="vintage-heading text-3xl md:text-4xl lg:text-5xl leading-tight group-hover:text-white/80 transition-colors">
                        {heroStory.title}
                      </h1>
                      {heroStory.subtitle && (
                        <p className="text-xl text-white/60">{heroStory.subtitle}</p>
                      )}
                      <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                        {heroStory.excerpt}
                      </p>
                      <p className="text-sm text-white/50">By {heroStory.author}</p>
                    </div>
                  </Link>
                </div>

                {/* Secondary Featured Story */}
                <div className="lg:border-l lg:border-white/10 lg:pl-8">
                  {secondaryFeatured && (
                    <Link href={`/story/${secondaryFeatured.slug}`} className="group block">
                      <div className="aspect-[4/3] bg-white/5 mb-4 overflow-hidden">
                        {secondaryFeatured.imageUrl ? (
                          <img
                            src={secondaryFeatured.imageUrl}
                            alt={secondaryFeatured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                            <span className="text-white/30 text-xs tracking-widest uppercase">
                              {secondaryFeatured.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-white/50 uppercase tracking-widest">
                            {secondaryFeatured.category}
                          </span>
                        </div>
                        <h2 className="vintage-heading text-xl leading-snug group-hover:text-white/80 transition-colors">
                          {secondaryFeatured.title}
                        </h2>
                        <p className="text-white/60 text-sm line-clamp-3">
                          {secondaryFeatured.excerpt}
                        </p>
                        <p className="text-xs text-white/40">By {secondaryFeatured.author}</p>
                      </div>
                    </Link>
                  )}

                  {/* Quick Links */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                      Latest Headlines
                    </h3>
                    <div className="space-y-4">
                      {remainingStories.slice(0, 3).map((story) => (
                        <Link
                          key={story.id}
                          href={`/story/${story.slug}`}
                          className="block group"
                        >
                          <p className="text-sm text-white/80 group-hover:text-white transition-colors leading-snug">
                            {story.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Stories Grid */}
        <section className="py-12 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="vintage-heading text-2xl">Latest Stories</h2>
              <Link
                href="/archive"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                View Archive →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingStories.slice(0, 6).map((story) => (
                <Link
                  key={story.id}
                  href={`/story/${story.slug}`}
                  className="group story-card block"
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
                      <span className="text-white/50 uppercase tracking-widest">
                        {story.category}
                      </span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/40">{formatDate(story.publishedAt)}</span>
                    </div>
                    <h3 className="vintage-heading text-lg leading-snug group-hover:text-white/80 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-2">{story.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="vintage-heading text-2xl mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => {
                const categoryStories = getStoriesByCategory(category);
                return (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="group block p-6 border border-white/10 hover:border-white/30 transition-colors text-center"
                  >
                    <h3 className="vintage-heading text-lg mb-2 group-hover:text-white/80 transition-colors">
                      {category}
                    </h3>
                    <p className="text-xs text-white/40">
                      {categoryStories.length} {categoryStories.length === 1 ? 'story' : 'stories'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSignup />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Image
                src="/images/exotics-weekly-header-logo.png"
                alt="Exotics Weekly"
                width={200}
                height={50}
                className="h-10 w-auto mb-4"
              />
              <p className="text-white/50 text-sm max-w-md">
                The world&apos;s greatest car news outlet. Covering exotic automobiles,
                historic motorsport, and the art of collecting since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                Categories
              </h4>
              <nav className="space-y-2">
                {CATEGORIES.slice(0, 4).map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="block text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                Company
              </h4>
              <nav className="space-y-2">
                <Link
                  href="/about"
                  className="block text-sm text-white/70 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/archive"
                  className="block text-sm text-white/70 hover:text-white transition-colors"
                >
                  Archive
                </Link>
                <Link
                  href="/admin"
                  className="block text-sm text-white/70 hover:text-white transition-colors"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-white/40 text-xs">
              © {new Date().getFullYear()} Exotics Weekly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
