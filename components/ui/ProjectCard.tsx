'use client';

import { useState } from 'react';
import { Tag } from './Tag';
import { Icon } from './Icon';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  tagCategory?: string;
}

export function ProjectCard({ title, description, tags, link, tagCategory = 'accent' }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)',
        padding: '20px', border: '1px solid var(--border)',
        borderLeft: `3px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-sm)',
        transition: 'all var(--trans-normal)',
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: link ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ fontSize: 'var(--text-h4)', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
          {title}
        </h3>
        {link && <Icon name="externalLink" size={14} color="var(--text-muted)" />}
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6, flex: 1 }}>
        {description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(t => <Tag key={t} label={t} category={tagCategory} small />)}
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {card}
      </a>
    );
  }

  return card;
}
