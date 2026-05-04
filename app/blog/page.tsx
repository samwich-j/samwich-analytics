import { getPosts } from '@/lib/posts';
import { BlogCard } from '@/components/ui/BlogCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="blog-list-inner">
      <SectionHeading>Blog</SectionHeading>
      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          No posts yet — check back soon.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map(post => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
