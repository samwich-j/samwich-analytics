import { getPosts } from '@/lib/posts';
import { BlogCard } from '@/components/ui/BlogCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default async function DraftsPage() {
  const allPosts = await getPosts({ includeAllDrafts: true });
  const drafts = allPosts.filter(p => p.isDraft);
  const published = allPosts.filter(p => !p.isDraft);

  return (
    <div className="blog-list-inner">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Private</div>
        <SectionHeading>Drafts</SectionHeading>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: -8 }}>
          All posts — drafts and published. Only you can see this page.
        </p>
      </div>

      {drafts.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Drafts ({drafts.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drafts.map(post => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </section>
      )}

      {drafts.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 40, fontStyle: 'italic' }}>
          No drafts — all posts are published.
        </p>
      )}

      <section>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Published ({published.length})
        </h3>
        {published.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {published.map(post => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>No published posts yet.</p>
        )}
      </section>
    </div>
  );
}
