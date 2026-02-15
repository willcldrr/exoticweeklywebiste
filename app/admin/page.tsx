'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStories } from '@/lib/stories-context';
import { Story, StoryCategory, CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface StoryFormData {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  author: string;
  category: StoryCategory;
  tags: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
}

const initialFormData: StoryFormData = {
  title: '',
  subtitle: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'News',
  tags: '',
  featured: false,
  status: 'draft',
};

function StoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Story',
}: {
  initialData?: Partial<StoryFormData>;
  onSubmit: (data: StoryFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [formData, setFormData] = useState<StoryFormData>({
    ...initialFormData,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="bg-white/5 border-white/20 text-white min-h-[80px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (HTML) *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="bg-white/5 border-white/20 text-white min-h-[200px] font-mono text-sm"
          placeholder="<p>Your article content here...</p>"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="bg-white/5 border-white/20 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value as StoryCategory })
            }
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="Ferrari, Auction, Record Sale"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as 'draft' | 'published' | 'archived' })
            }
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Featured Story</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="bg-white text-black hover:bg-white/90">
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { stories, addStory, updateStory, deleteStory } = useStories();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = stories
    .filter((story) => {
      if (filter === 'all') return true;
      return story.status === filter;
    })
    .filter((story) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const handleCreate = (data: StoryFormData) => {
    const tags = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addStory({
      slug: generateSlug(data.title),
      title: data.title,
      subtitle: data.subtitle || undefined,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      category: data.category,
      tags,
      imageUrl: '/placeholder.jpg',
      publishedAt: new Date().toISOString(),
      featured: data.featured,
      status: data.status,
    });

    setIsCreateOpen(false);
  };

  const handleUpdate = (data: StoryFormData) => {
    if (!editingStory) return;

    const tags = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateStory(editingStory.id, {
      slug: generateSlug(data.title),
      title: data.title,
      subtitle: data.subtitle || undefined,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      category: data.category,
      tags,
      featured: data.featured,
      status: data.status,
    });

    setEditingStory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      deleteStory(id);
    }
  };

  const stats = {
    total: stories.length,
    published: stories.filter((s) => s.status === 'published').length,
    drafts: stories.filter((s) => s.status === 'draft').length,
    featured: stories.filter((s) => s.featured).length,
  };

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
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/50">Admin Dashboard</span>
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="vintage-heading text-3xl mb-2">Story Management</h1>
            <p className="text-white/50">Create, edit, and manage your news stories</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                + New Story
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="vintage-heading text-2xl">Create New Story</DialogTitle>
              </DialogHeader>
              <StoryForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateOpen(false)}
                submitLabel="Create Story"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border border-white/10 bg-white/5">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-white/50">Total Stories</p>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <p className="text-2xl font-bold">{stats.published}</p>
            <p className="text-sm text-white/50">Published</p>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <p className="text-2xl font-bold">{stats.drafts}</p>
            <p className="text-sm text-white/50">Drafts</p>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <p className="text-2xl font-bold">{stats.featured}</p>
            <p className="text-sm text-white/50">Featured</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/20 text-white max-w-xs"
          />
          <div className="flex gap-2">
            {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'border-white/20 text-white hover:bg-white/10'
                }
                size="sm"
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stories Table */}
        <div className="border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-widest text-white/50">
                    Title
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-widest text-white/50">
                    Category
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-widest text-white/50">
                    Author
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-widest text-white/50">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-widest text-white/50">
                    Date
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-widest text-white/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{story.title}</span>
                        {story.featured && (
                          <span className="text-xs bg-white/10 px-2 py-0.5">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white/70">{story.category}</td>
                    <td className="p-4 text-white/70">{story.author}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 ${
                          story.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : story.status === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {story.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-sm">
                      {formatDate(story.publishedAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/story/${story.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/50 hover:text-white hover:bg-white/10"
                          >
                            View
                          </Button>
                        </Link>
                        <Dialog
                          open={editingStory?.id === story.id}
                          onOpenChange={(open) => !open && setEditingStory(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStory(story)}
                              className="text-white/50 hover:text-white hover:bg-white/10"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="vintage-heading text-2xl">
                                Edit Story
                              </DialogTitle>
                            </DialogHeader>
                            {editingStory && (
                              <StoryForm
                                initialData={{
                                  title: editingStory.title,
                                  subtitle: editingStory.subtitle || '',
                                  excerpt: editingStory.excerpt,
                                  content: editingStory.content,
                                  author: editingStory.author,
                                  category: editingStory.category,
                                  tags: editingStory.tags.join(', '),
                                  featured: editingStory.featured,
                                  status: editingStory.status,
                                }}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingStory(null)}
                                submitLabel="Update Story"
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(story.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStories.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-white/50">No stories found</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/40 text-xs">
            Exotics Weekly Admin Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
