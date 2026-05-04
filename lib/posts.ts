import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  isDraft: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export async function getPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const posts = files.map(file => {
    const slug = file.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '2000-01-01',
      description: data.description ?? '',
      tags: data.tags ?? [],
      isDraft: data.draft === true,
    } satisfies PostMeta;
  });

  const isDev = process.env.NODE_ENV === 'development';

  return posts
    .filter(p => isDev || !p.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  const isDev = process.env.NODE_ENV === 'development';

  for (const ext of ['md', 'mdx']) {
    const filePath = path.join(POSTS_DIR, `${slug}.${ext}`);
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const isDraft = data.draft === true;

    if (!isDev && isDraft) return null;

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '2000-01-01',
      description: data.description ?? '',
      tags: data.tags ?? [],
      isDraft,
      content,
    };
  }

  return null;
}
