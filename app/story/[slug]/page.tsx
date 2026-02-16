'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStories } from '@/lib/stories-context';
import { CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
    <div className="bg-white/5 border border-white/10 p-8 relative racing-border-top">
      <div className="flex justify-center mb-4">
        <span className="text-white/15 text-xl">⚙</span>
      </div>
      <h3 className="vintage-heading text-xl mb-3 text-center">The Weekly Dispatch</h3>
      <p className="text-white/60 text-sm mb-4">
        Subscribe to receive the finest automotive journalism delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-10"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-white text-black hover:bg-white/90 font-medium"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {message && <p className="mt-3 text-white/60 text-xs">{message}</p>}
    </div>
  );
}

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { getStoryBySlug, getLatestStories } = useStories();
  const story = getStoryBySlug(resolvedParams.slug);
  const relatedStories = getLatestStories(4).filter((s) => s.slug !== resolvedParams.slug);

  if (!story) {
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
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="vintage-heading text-4xl mb-4">Story Not Found</h1>
          <p className="text-white/60 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
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
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-12 border-b border-white/10 relative">
            <div className="flex items-center gap-3 text-sm mb-6">
              <Link
                href={`/category/${story.category.toLowerCase()}`}
                className="text-white/70 hover:text-white racing-accent-hover uppercase tracking-widest text-xs"
              >
                {story.category}
              </Link>
              <span className="text-white/30">·</span>
              <span className="text-white/50">{formatDate(story.publishedAt)}</span>
            </div>

            <h1 className="vintage-heading text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              {story.title}
            </h1>

            {story.subtitle && (
              <p className="text-xl md:text-2xl text-white/60 mb-6">{story.subtitle}</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white/20">⚙</span>
                <p className="text-white/80">By {story.author}</p>
              </div>
            </div>

            {/* Racing stripe accent under header */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--racing-red)] to-transparent opacity-50" />
          </header>

          {/* Featured Image */}
          <div className="aspect-[16/9] bg-white/5 my-10 overflow-hidden">
            {story.imageUrl ? (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                <span className="text-white/30 text-sm tracking-widest uppercase">
                  {story.category}
                </span>
              </div>
            )}
          </div>
          {story.imageCaption && (
            <p className="text-sm text-white/50 text-center -mt-6 mb-10 italic">
              {story.imageCaption}
            </p>
          )}

          {/* Article Content */}
          <div className="grid lg:grid-cols-4 gap-12 pb-12">
            <div className="lg:col-span-3">
              <div
                className="article-content text-white/90"
                dangerouslySetInnerHTML={{ __html: story.content }}
              />

              {/* Tags */}
              {story.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-white/5 text-white/70 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                <NewsletterSignup />

                {/* Related Stories */}
                {relatedStories.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                      Related Stories
                    </h4>
                    <div className="space-y-4">
                      {relatedStories.slice(0, 3).map((related) => (
                        <Link
                          key={related.id}
                          href={`/story/${related.slug}`}
                          className="block group"
                        >
                          <p className="text-sm text-white/80 group-hover:text-white transition-colors leading-snug">
                            {related.title}
                          </p>
                          <p className="text-xs text-white/40 mt-1">
                            {related.category}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>

        {/* Racing Stripe Divider */}
        <div className="racing-stripe" />

        {/* More Stories */}
        <section className="border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="vintage-heading text-2xl mb-8 section-header">More Stories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedStories.map((related) => (
                <Link
                  key={related.id}
                  href={`/story/${related.slug}`}
                  className="group luxury-card block p-3 -m-3"
                >
                  <div className="aspect-[16/10] bg-white/5 mb-4 overflow-hidden">
                    {related.imageUrl ? (
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                        <span className="text-white/30 text-xs tracking-widest uppercase">
                          {related.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-white/50 uppercase tracking-widest text-xs">
                      {related.category}
                    </span>
                    <h3 className="vintage-heading text-base leading-snug group-hover:text-white/80 transition-colors">
                      {related.title}
                    </h3>
                  </div>
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
