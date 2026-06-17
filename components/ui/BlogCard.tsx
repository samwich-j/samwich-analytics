'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tag } from './Tag';

interface BlogCardProps {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
  isDraft?: boolean;
  pinned?: boolean;
}

export function BlogCard({ title, date, description, tags, slug, isDraft, pinned }: BlogCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '18px 16px', borderRadius: 'var(--radius-md)',
          background: hovered ? 'var(--bg-hover)' : 'transparent',
          borderLeft: `3px solid ${hovered ? 'var(--accent)' : 'transparent'}`,
          transition: 'all var(--trans-fast)',
          marginBottom: 2, cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 'var(--text-h4)', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
            {title}
          </h3>
          {pinned && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', background: 'var(--bg-active)',
              color: 'var(--text-muted)', padding: '2px 7px', borderRadius: 'var(--radius-full)',
            }}>
              Pinned
            </span>
          )}
          {isDraft && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', background: 'var(--accent-light)',
              color: 'var(--accent)', padding: '2px 7px', borderRadius: 'var(--radius-full)',
            }}>
              Draft
            </span>
          )}
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{date}</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {tags.map(t => <Tag key={t} label={t} small />)}
          </div>
        </div>
      </div>
    </Link>
  );
}
