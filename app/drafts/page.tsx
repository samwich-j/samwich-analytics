import { getPosts } from '@/lib/posts';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

const REPO = 'samwich-j/samwich-analytics';

function PostRow({ slug, title, date, description, isDraft }: { slug: string; title: string; date: string; description: string; tags?: string[]; isDraft: boolean }) {
  const editUrl = `https://github.com/${REPO}/edit/main/content/posts/${slug}.md`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-alt)', transition: 'border-color var(--trans-fast)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/blog/${slug}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          {title}
        </Link>
        {description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description}</p>}
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{date}</span>
      {isDraft && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-lighter)', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Draft</span>}
      <a href={editUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', whiteSpace: 'nowrap', transition: 'all var(--trans-fast)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </a>
    </div>
  );
}

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
          All posts — drafts and published. Edit on GitHub to publish or update.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4, opacity: 0.7 }}>
          To publish a draft, click Edit and change <code style={{ background: 'var(--accent-lighter)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>draft: true</code> to <code style={{ background: 'var(--accent-lighter)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>draft: false</code> in the frontmatter.
        </p>
      </div>

      {drafts.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Drafts ({drafts.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drafts.map(post => (
              <PostRow key={post.slug} {...post} />
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
              <PostRow key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>No published posts yet.</p>
        )}
      </section>

      <div style={{ marginTop: 40, padding: '16px 20px', borderRadius: 10, background: 'var(--accent-lighter)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6 }}>Create a new post</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Add a <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>.md</code> file to{' '}
          <a href={`https://github.com/${REPO}/tree/main/content/posts`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>content/posts/</a>{' '}
          with frontmatter (title, date, description, tags, draft).
        </p>
      </div>
    </div>
  );
}
