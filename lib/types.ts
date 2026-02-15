export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  author: string;
  category: StoryCategory;
  tags: string[];
  imageUrl: string;
  imageCaption?: string;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
}

export type StoryCategory =
  | 'News'
  | 'Reviews'
  | 'Auctions'
  | 'Heritage'
  | 'Motorsport'
  | 'Collecting';

export const CATEGORIES: StoryCategory[] = [
  'News',
  'Reviews',
  'Auctions',
  'Heritage',
  'Motorsport',
  'Collecting'
];

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}
