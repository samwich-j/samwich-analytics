interface TagProps {
  label: string;
  category?: string;
  small?: boolean;
}

const CAT_STYLES: Record<string, { bg: string; color: string }> = {
  work:     { bg: 'var(--cat-work-bg)',     color: 'var(--cat-work-text)' },
  study:    { bg: 'var(--cat-study-bg)',    color: 'var(--cat-study-text)' },
  personal: { bg: 'var(--cat-personal-bg)', color: 'var(--cat-personal-text)' },
  health:   { bg: 'var(--cat-health-bg)',   color: 'var(--cat-health-text)' },
  travel:   { bg: 'var(--cat-travel-bg)',   color: 'var(--cat-travel-text)' },
  free:     { bg: 'var(--cat-free-bg)',     color: 'var(--cat-free-text)' },
  accent:   { bg: 'var(--accent-light)',    color: 'var(--accent)' },
  gold:     { bg: 'var(--accent-gold-light)', color: 'var(--accent-gold)' },
  default:  { bg: 'var(--bg-active)',       color: 'var(--text-primary)' },
};

export function Tag({ label, category = 'default', small = false }: TagProps) {
  const { bg, color } = CAT_STYLES[category] ?? CAT_STYLES.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: bg, color,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: small ? '0.7rem' : '0.75rem',
      fontWeight: 500, letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
