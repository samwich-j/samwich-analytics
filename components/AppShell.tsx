'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './ui/Sidebar';
import { Icon } from './ui/Icon';
import { useTheme } from './providers/ThemeProvider';

const SCREEN_TITLES: Record<string, string> = {
  '/':        'Home',
  '/blog':    'Blog',
  '/planner': 'Planner',
  '/notes':   'Notes',
  '/login':   'Sign In',
  '/resume':    'Résumé',
  '/portfolio': 'Portfolio',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const title = SCREEN_TITLES[pathname] ?? (pathname.startsWith('/blog/') ? 'Post' : 'Page');

  return (
    <div className="app-shell" data-theme={theme}>
      {!mobile && <Sidebar />}
      {mobile && (
        <Sidebar isMobile drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      )}

      <main className="content-area" style={{ background: 'var(--bg)' }}>
        {mobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px', height: 52, borderBottom: '1px solid var(--border)',
            background: 'var(--sidebar-bg)', flexShrink: 0,
          }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', padding: 4 }}
              aria-label="Open menu"
            >
              <Icon name="menu" size={20} />
            </button>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{title}</span>
            <button
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
