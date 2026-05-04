import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="reading-inner">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        {post.isDraft && (
          <span style={{
            display: 'inline-block', marginBottom: 12,
            padding: '2px 10px', borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)', color: '#fff',
            fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em',
          }}>
            DRAFT
          </span>
        )}
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{post.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="md-body">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
