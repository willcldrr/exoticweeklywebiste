import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/types';

export default function AboutPage() {
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
        {/* Hero Section */}
        <section className="border-b border-white/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              About Exotics Weekly
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl">
              The world&apos;s greatest car news outlet. Covering exotic automobiles with the
              seriousness and reverence they deserve.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                <div className="article-content text-white/80">
                  <p>
                    Exotics Weekly exists because the exotic car world moves fast, and most
                    coverage can&apos;t keep up. There&apos;s plenty of noise—press releases,
                    influencer drama, and hype cycles for new cars—but almost no place that
                    filters the industry through a sharper, operator and enthusiast-centric lens.
                  </p>

                  <p>
                    Exotics Weekly fills that gap. Through a curated message every Thursday, we
                    focus on the forces that actually shape the space: pricing swings, insurance
                    tightening, allocation politics, rental fleet economics, and the subtle shifts
                    that determine why certain models hold value while others quietly collapse.
                  </p>

                  <p>
                    The idea came out of real work, not theory. Our founder started Scale Exotics
                    at sixteen and spent years inside the operator side of the industry, watching
                    patterns, dealing with clients, seeing which cars performed on paper and which
                    only performed on Instagram.
                  </p>

                  <p>
                    After enough time, it became obvious that there was no central source for
                    exotic operator-level intelligence. Nothing built for people who care about the
                    business behind the cars. Exotics Weekly was created to solve that.
                  </p>

                  <p>
                    Some weeks the briefing is quick and sharp—going over new specs and pricing
                    news. Other weeks it goes on tangents worth exploring: why operators misread
                    seasonality, why buyers pretend color doesn&apos;t matter (it does), or why
                    certain markets behave like entirely separate economies.
                  </p>

                  <p>
                    The goal is to remove the noise, surface the truth, and give operators and
                    serious enthusiasts information they can actually use. If you value that kind
                    of clarity, this is the publication built for you.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                <div className="border border-white/10 p-6">
                  <h3 className="vintage-heading text-lg mb-4">Our Coverage</h3>
                  <ul className="space-y-3 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-white/30">—</span>
                      Market analysis and valuations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30">—</span>
                      Historic auction coverage
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30">—</span>
                      Motorsport heritage
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30">—</span>
                      Collector car insights
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30">—</span>
                      Industry intelligence
                    </li>
                  </ul>
                </div>

                <div className="border border-white/10 p-6">
                  <h3 className="vintage-heading text-lg mb-4">Contact</h3>
                  <p className="text-sm text-white/70">
                    For press inquiries, story tips, or partnership opportunities, please reach
                    out via our editorial team.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="border-t border-white/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="vintage-heading text-2xl mb-8 section-header">Our Standards</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="vintage-heading text-lg mb-3">Accuracy</h3>
                <p className="text-sm text-white/60">
                  Every fact is verified. Every claim is substantiated. We do not traffic in
                  rumor or speculation.
                </p>
              </div>
              <div>
                <h3 className="vintage-heading text-lg mb-3">Independence</h3>
                <p className="text-sm text-white/60">
                  Our editorial decisions are made without influence from manufacturers,
                  dealers, or advertisers.
                </p>
              </div>
              <div>
                <h3 className="vintage-heading text-lg mb-3">Expertise</h3>
                <p className="text-sm text-white/60">
                  Our contributors are practitioners—collectors, operators, and historians who
                  understand the subject from within.
                </p>
              </div>
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
