'use client';

import { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

const styles = {
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, fontFamily: 'var(--font-ui)', fontWeight: 500, borderRadius: 'var(--radius-md)',
    cursor: 'pointer', transition: 'all var(--trans-fast)', border: '1.5px solid transparent',
    textDecoration: 'none', whiteSpace: 'nowrap' as const,
  },
  size: {
    sm: { padding: '6px 12px', fontSize: '0.8rem' },
    md: { padding: '8px 18px', fontSize: '0.9rem' },
    lg: { padding: '10px 24px', fontSize: '1rem' },
  },
  variant: {
    primary: { background: 'var(--accent)', color: 'var(--text-inverse)', borderColor: 'var(--accent)' },
    secondary: { background: 'transparent', color: 'var(--accent)', borderColor: 'var(--accent)' },
    ghost: { background: 'transparent', color: 'var(--text-primary)', borderColor: 'transparent' },
    danger: { background: 'transparent', color: '#c0392b', borderColor: '#c0392b' },
  },
};

export function Btn({ variant = 'primary', size = 'md', icon, children, style, disabled, ...props }: BtnProps) {
  return (
    <button
      style={{
        ...styles.base,
        ...styles.size[size],
        ...styles.variant[variant],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />}
      {children}
    </button>
  );
}
