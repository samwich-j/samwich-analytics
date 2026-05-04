'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Icon } from './Icon';

const PUBLIC_NAV = [
  { href: '/',     icon: 'home', label: 'Home' },
  { href: '/blog', icon: 'blog', label: 'Blog' },
];

const PRIVATE_NAV = [
  { href: '/planner', icon: 'planner', label: 'Planner' },
  { href: '/notes',   icon: 'tasks',   label: 'Notes' },
];

interface SidebarProps {
  isMobile?: boolean;
  drawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

function NavItem({ href, icon, label, active }: {
  href: string; icon: string; label: string; active: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 10px', borderRadius: 6,
        background: active ? 'var(--sidebar-item-active-bg)' : 'transparent',
        color: active ? 'var(--sidebar-item-active-text)' : 'var(--text-primary)',
        fontWeight: active ? 500 : 400, fontSize: '0.875rem',
        cursor: 'pointer', transition: 'background var(--trans-fast)',
        fontFamily: 'var(--font-ui)',
      }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'var(--sidebar-item-hover)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <Icon name={icon} size={16} color={active ? 'var(--accent)' : 'var(--text-muted)'} />
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
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
            samwich{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 400 }}>analytics</span>
          </span>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '4px 8px 8px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Workspace
        </div>

        {PUBLIC_NAV.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
          />
        ))}

        {/* Dark mode — right after public nav, above the divider */}
        <div style={{ paddingTop: 8, marginTop: 4, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
              borderRadius: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem',
              fontFamily: 'var(--font-ui)', width: '100%', transition: 'background var(--trans-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} color="var(--text-muted)" />
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        {/* Private section — only visible when signed in */}
        {loggedIn && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 8px 8px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Private
            </div>
            {PRIVATE_NAV.map(item => (
              <NavItem
                key={item.href}
                {...item}
                active={pathname.startsWith(item.href)}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Bottom: signed-in user or subtle Admin link */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--sidebar-border)' }}>
        {loggedIn ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white', fontWeight: 600, flexShrink: 0 }}>
                S
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Sam Johnston
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                borderRadius: 6, background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem',
                fontFamily: 'var(--font-ui)', width: '100%',
                transition: 'background var(--trans-fast)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="user" size={13} />
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{
              color: 'var(--text-muted)', fontSize: '0.7rem',
              padding: '4px 8px', opacity: 0.5,
              transition: 'opacity var(--trans-fast)',
              cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
            >
              Admin
            </span>
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
