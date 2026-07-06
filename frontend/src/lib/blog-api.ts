import type { BlogPost, BlogCategory } from '@/data/blog';
import { BLOG_CATEGORIES } from '@/data/blog';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://api.nonalix-ci.com';

interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  contentHtml: string;
  category: string;
  categoryLabel: string | null;
  tags: string | null;
  image: string | null;
  author: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  keywords: string | null;
  metaOgTitle: string | null;
  metaOgDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
}

function safeParseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; } catch { return fallback; }
}

function convertApiPost(post: ApiBlogPost): BlogPost {
  const tags = safeParseJSON<string[]>(post.tags, []);
  const category = (post.category as BlogCategory) in BLOG_CATEGORIES
    ? (post.category as BlogCategory)
    : 'ia-automatisation' as BlogCategory;
  return {
    slug: post.slug,
    title: post.title,
    description: post.description || '',
    date: post.publishedAt || post.createdAt,
    category,
    categoryLabel: post.categoryLabel || BLOG_CATEGORIES[category],
    readingTime: post.readingTime,
    image: post.image || '/images/hero/ai-automation-dashboard.jpg',
    tags,
    featured: post.featured,
    content: post.contentHtml,
  };
}

export async function fetchApiBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/blog`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: ApiBlogPost[] = await res.json();
    return data.map(convertApiPost);
  } catch {
    return [];
  }
}

export async function fetchApiBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return undefined;
    const data: ApiBlogPost = await res.json();
    return convertApiPost(data);
  } catch {
    return undefined;
  }
}
