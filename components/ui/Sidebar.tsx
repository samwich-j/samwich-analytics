'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Icon } from './Icon';

const PUBLIC_NAV = [
  { href: '/',      icon: 'home',    label: 'Home' },
  { href: '/blog',  icon: 'blog',    label: 'Blog' },
];

const PRIVATE_NAV = [
  { href: '/planner', icon: 'planner', label: 'Planner' },
  { href: '/notes',   icon: 'notes',   label: 'Notes' },
];

interface SidebarProps {
  isMobile?: boolean;
  drawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

function NavItem({ href, icon, label, active, locked }: {
  href: string; icon: string; label: string; active: boolean; locked?: boolean;
}) {
  return (
    <Link href={locked ? '/login' : href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 'var(--radius-md)',
        background: active ? 'var(--sidebar-item-active-bg)' : 'transparent',
        color: active ? 'var(--sidebar-item-active-text)' : locked ? 'var(--text-muted)' : 'var(--text-primary)',
        fontWeight: active ? 500 : 400, fontSize: 'var(--text-sm)',
        cursor: 'pointer', transition: 'all var(--trans-fast)',
        opacity: locked ? 0.6 : 1,
      }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'var(--sidebar-item-hover)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <Icon name={locked ? 'lock' : icon} size={16} />
        <span style={{ flex: 1 }}>{label}</span>
      </div>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const loggedIn = !!session;

  return (
    <div style={{
      width: 'var(--sidebar-width)', height: '100%',
      background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)',
      display: 'flex', flexDirection: 'column', padding: '16px 12px',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Logo / workspace name */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '4px 4px 0' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
          samwich analytics
        </span>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {PUBLIC_NAV.map(item => (
          <NavItem key={item.href} {...item} active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))} />
        ))}

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 4px' }} />

        {PRIVATE_NAV.map(item => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} locked={!loggedIn} />
        ))}
      </nav>

      {/* Bottom: theme + auth */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 'var(--radius-md)', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-ui)', width: '100%', transition: 'all var(--trans-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {loggedIn ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderRadius: 'var(--radius-md)', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-ui)', width: '100%', transition: 'all var(--trans-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Icon name="user" size={16} />
            Sign out
          </button>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
            }}>
              <Icon name="lock" size={16} />
              Sign in
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ isMobile, drawerOpen, onCloseDrawer }: SidebarProps) {
  if (isMobile) {
    return (
      <>
        {drawerOpen && (
          <div
            onClick={onCloseDrawer}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
        )}
        <div style={{
          position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--trans-normal)',
        }}>
          <SidebarContent onClose={onCloseDrawer} />
        </div>
      </>
    );
  }

  return <SidebarContent />;
}
