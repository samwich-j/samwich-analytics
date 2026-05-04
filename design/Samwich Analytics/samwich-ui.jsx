// samwich-ui.jsx — Shared UI components for Samwich Analytics
// Exported to window for use across script files

const { useState, useEffect, useRef } = React;

/* ── Logo SVG ── */
function SamwichLogo({ theme, size = 32 }) {
  const fill = theme === 'dark' ? '#d4af37' : '#778450';
  const textColor = theme === 'dark' ? '#fefefe' : '#444444';
  return (
    <svg width={size * 3.2} height={size} viewBox="0 0 128 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="8" width="24" height="24" rx="4" fill={fill} />
      <rect x="4" y="12" width="16" height="3" rx="1.5" fill="white" opacity="0.9" />
      <rect x="4" y="18" width="10" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="4" y="24" width="13" height="3" rx="1.5" fill="white" opacity="0.5" />
      <text x="30" y="26" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="14" fill={textColor} letterSpacing="-0.3">samwich</text>
      <text x="30" y="37" fontFamily="Poppins, sans-serif" fontWeight="400" fontSize="9" fill={fill} letterSpacing="0.5">analytics</text>
    </svg>
  );
}

/* ── Icon Components ── */
function Icon({ name, size = 16, color = 'currentColor' }) {
  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
    blog: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></>,
    planner: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    externalLink: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    zoomIn: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>,
    zoomOut: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></>,
    google: <><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></>,
    tasks: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  );
}

/* ── Sidebar ── */
function Sidebar({ currentScreen, onNavigate, theme, onToggleTheme, isMobile, drawerOpen, onCloseDrawer, loggedIn, onSignOut }) {
  const publicItems = [
    { id: 'portfolio', label: 'Home', icon: 'home' },
    { id: 'blog', label: 'Blog', icon: 'blog' },
  ];
  const privateItems = [
    { id: 'drafts', label: 'Drafts', icon: 'tag' },
    { id: 'planner', label: 'Planner', icon: 'planner' },
    { id: 'notes', label: 'Notes', icon: 'tasks' },
  ];

  const sidebarStyle = {
    width: 'var(--sidebar-width)',
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--sidebar-border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0',
    flexShrink: 0,
    position: isMobile ? 'fixed' : 'relative',
    top: 0, left: 0, bottom: 0,
    zIndex: isMobile ? 200 : 1,
    transform: isMobile ? (drawerOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
    transition: 'transform var(--trans-normal)',
    boxShadow: isMobile && drawerOpen ? 'var(--shadow-lg)' : 'none',
  };

  return (
    <>
      {isMobile && drawerOpen && (
        <div onClick={onCloseDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }} />
      )}
      <aside style={sidebarStyle}>
        {/* Logo area */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SamwichLogo theme={theme} size={28} />
            {isMobile && (
              <button onClick={onCloseDrawer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                <Icon name="x" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Public items */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ padding: '4px 8px 8px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workspace</div>
            {publicItems.map(item => {
              const isActive = currentScreen === item.id || (currentScreen === 'blog-post' && item.id === 'blog');
              return <SidebarItem key={item.id} item={item} isActive={isActive} onNavigate={() => { onNavigate(item.id); if (isMobile) onCloseDrawer(); }} />;
            })}
          </div>

          {/* Dark mode toggle — below workspace items */}
          <div style={{ padding: '8px 0 4px', borderTop: '1px solid var(--border)', borderBottom: loggedIn ? 'none' : '1px solid var(--border)', marginBottom: loggedIn ? 0 : 4 }}>
            <button onClick={onToggleTheme} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
              color: 'var(--text-muted)', fontSize: '0.875rem', width: '100%', textAlign: 'left',
              fontFamily: 'var(--font-ui)', transition: 'background var(--trans-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-item-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} color="var(--text-muted)" />
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>

          {/* Private items — only when signed in */}
          {loggedIn && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <div style={{ padding: '4px 8px 8px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Private</div>
              {privateItems.map(item => {
                const isActive = currentScreen === item.id || (currentScreen === 'login' && item.id === 'planner');
                return <SidebarItem key={item.id} item={item} isActive={isActive} soon={item.soon} onNavigate={() => { if (!item.soon) { onNavigate(item.id); if (isMobile) onCloseDrawer(); } }} />;
              })}
            </div>
          )}
        </nav>

        {/* Bottom: user / admin sign-in */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--sidebar-border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {loggedIn ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white', fontWeight: 600, flexShrink: 0 }}>S</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sam Johnston</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Google account</div>
                </div>
              </div>
              <button onClick={onSignOut} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
                color: 'var(--text-muted)', fontSize: '0.75rem', width: '100%', textAlign: 'left',
                fontFamily: 'var(--font-ui)', transition: 'background var(--trans-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-item-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '0.7rem', width: '100%', textAlign: 'right',
              fontFamily: 'var(--font-ui)', padding: '4px 8px', opacity: 0.5,
              transition: 'opacity var(--trans-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}>
              Admin
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ item, isActive, onNavigate, locked, soon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 10px', borderRadius: 6, width: '100%',
        background: isActive ? 'var(--sidebar-item-active-bg)' : hovered && !soon ? 'var(--sidebar-item-hover)' : 'transparent',
        border: 'none', cursor: soon ? 'default' : 'pointer', textAlign: 'left',
        color: isActive ? 'var(--sidebar-item-active-text)' : (locked || soon) ? 'var(--text-muted)' : 'var(--text-primary)',
        fontSize: '0.875rem', fontWeight: isActive ? 500 : 400,
        opacity: soon ? 0.5 : 1,
        transition: 'background var(--trans-fast), color var(--trans-fast)',
        fontFamily: 'var(--font-ui)',
      }}>
      <Icon name={item.icon} size={16} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {soon && <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Soon</span>}
      {locked && !soon && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )}
    </button>
  );
}

/* ── Mobile Top Bar ── */
function TopBar({ title, onMenuOpen, theme, onToggleTheme }) {
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--sidebar-border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <button onClick={onMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
        <Icon name="menu" size={20} />
      </button>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      <button onClick={onToggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>
    </div>
  );
}

/* ── Button Components ── */
function Btn({ variant = 'primary', size = 'md', children, onClick, disabled, icon, style: extraStyle }) {
  const [hovered, setHovered] = useState(false);
  const sizes = { sm: { padding: '6px 12px', fontSize: '0.8rem' }, md: { padding: '9px 18px', fontSize: '0.875rem' }, lg: { padding: '12px 24px', fontSize: '1rem' } };
  const variants = {
    primary: {
      background: hovered && !disabled ? 'var(--accent-hover)' : 'var(--accent)',
      color: 'white', border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)', border: '1.5px solid var(--accent)',
      ...(hovered && !disabled ? { background: 'var(--accent-lighter)' } : {}),
    },
    ghost: {
      background: hovered && !disabled ? 'var(--bg-hover)' : 'transparent',
      color: 'var(--text-primary)', border: 'none',
    },
    danger: {
      background: hovered && !disabled ? '#c0392b' : '#e74c3c',
      color: 'white', border: 'none',
    },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        ...sizes[size], borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--trans-fast)', opacity: disabled ? 0.5 : 1,
        outline: 'none',
        ...variants[variant],
        ...extraStyle,
      }}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

/* ── Tag / Pill ── */
function Tag({ label, category, small }) {
  const catColors = {
    work: { bg: 'var(--cat-work-bg)', color: 'var(--cat-work-text)' },
    study: { bg: 'var(--cat-study-bg)', color: 'var(--cat-study-text)' },
    personal: { bg: 'var(--cat-personal-bg)', color: 'var(--cat-personal-text)' },
    health: { bg: 'var(--cat-health-bg)', color: 'var(--cat-health-text)' },
    travel: { bg: 'var(--cat-travel-bg)', color: 'var(--cat-travel-text)' },
    free: { bg: 'var(--cat-free-bg)', color: 'var(--cat-free-text)' },
    accent: { bg: 'var(--accent-light)', color: 'var(--accent)' },
    gold: { bg: 'var(--accent-gold-light)', color: 'var(--accent-gold)' },
    default: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  };
  const colors = catColors[category] || catColors.default;
  return (
    <span style={{
      display: 'inline-block', padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 'var(--radius-full)', fontSize: small ? '0.7rem' : '0.75rem',
      fontWeight: 500, letterSpacing: '0.02em',
      background: colors.bg, color: colors.color,
    }}>{label}</span>
  );
}

/* ── Project Card ── */
function ProjectCard({ title, description, tags, tagCategory = 'accent' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      borderLeft: hovered ? '3px solid var(--accent)' : '1px solid var(--border)',
      padding: '20px', cursor: 'pointer',
      boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-sm)',
      transition: 'all var(--trans-normal)',
      transform: hovered ? 'translateY(-2px)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</h3>
        <Icon name="externalLink" size={14} color="var(--text-muted)" />
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>{description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(t => <Tag key={t} label={t} category={tagCategory} small />)}
      </div>
    </div>
  );
}

/* ── Blog Post Card ── */
function BlogCard({ title, date, description, tags, isDraft, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? 'var(--bg-hover)' : 'transparent',
      borderRadius: 'var(--radius-md)', padding: '16px',
      borderLeft: hovered ? '3px solid var(--accent)' : '3px solid transparent',
      cursor: 'pointer', transition: 'all var(--trans-fast)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</h3>
        {isDraft && <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--accent-lighter)', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em' }}>DRAFT</span>}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>{date}</div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 10 }}>{description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(t => <Tag key={t} label={t} small />)}
      </div>
    </div>
  );
}

/* ── Skills Section ── */
function SkillsSection() {
  const groups = [
    { label: 'Languages', skills: ['R', 'Python'], cat: 'accent' },
    { label: 'Visualization', skills: ['Tableau', 'Power BI'], cat: 'gold' },
    { label: 'Methods', skills: ['Statistical Analyses', 'Survey Design', 'Experiment Design'], cat: 'work' },
    { label: 'Tools', skills: ['Jamovi', 'Excel', 'Data Cleaning & Management'], cat: 'travel' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groups.map(g => (
        <div key={g.label}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{g.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.skills.map(s => <Tag key={s} label={s} category={g.cat} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Section Heading ── */
function SectionHeading({ children }) {
  return (
    <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
      {children}
    </h2>
  );
}

Object.assign(window, {
  SamwichLogo, Icon, Sidebar, TopBar, Btn, Tag, ProjectCard, BlogCard, SkillsSection, SectionHeading,
});
