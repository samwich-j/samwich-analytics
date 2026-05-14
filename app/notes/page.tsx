'use client';

import { useState, useRef, useEffect } from 'react';

function makeId() { return Math.random().toString(36).slice(2, 9); }
function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime(), m = Math.floor(diff / 60000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NB_ICONS: Record<string, React.ReactNode> = {
  school:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  work:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  research: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  default:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
};
const FileIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const FolderIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;

interface NoteBlock { id: string; type: string; content: string; checked?: boolean; }
interface QuickNote { id: string; title: string; blocks: NoteBlock[]; createdAt: Date; }
interface NotebookPage { id: string; title: string; type: 'note'; blocks: NoteBlock[]; }
interface NotebookSection { id: string; title: string; type: 'section'; children: NotebookPage[]; }
interface Notebook { id: string; title: string; color: string; textColor: string; description: string; children: (NotebookSection | NotebookPage)[]; }

const INITIAL_QUICK_NOTES: QuickNote[] = [
  { id: 'qn1', title: 'dbt incremental strategies', blocks: [{ id: 'b1', type: 'p', content: 'Look into dbt incremental strategies for **late-arriving data** — add a lookback window of ~3 hours.' }], createdAt: new Date(Date.now() - 1e3 * 60 * 10) },
  { id: 'qn2', title: 'Client follow-up', blocks: [{ id: 'b2', type: 'p', content: 'Follow up with client re: Q2 dashboard access. Check if Snowflake permissions are sorted.' }], createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 2) },
  { id: 'qn3', title: 'Reading', blocks: [{ id: 'b3', type: 'p', content: 'Read: _Designing Data-Intensive Applications_ ch. 4 — encoding and evolution.' }], createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24) },
];

const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: 'work', title: 'Work Projects', color: 'var(--cat-work-bg)', textColor: 'var(--cat-work-text)', description: 'Client work, pipelines, and dashboards',
    children: [
      { id: 'pipeline', title: 'Revenue Pipeline v2', type: 'note', blocks: [
        { id: 'p1', type: 'h1', content: 'Revenue Pipeline v2' },
        { id: 'p2', type: 'h2', content: 'Goals' },
        { id: 'p3', type: 'bullet', content: 'Migrate to _incremental_ dbt models' },
        { id: 'p4', type: 'bullet', content: 'Add attribution window config' },
        { id: 'p5', type: 'checkbox', content: 'Refactor staging models', checked: true },
        { id: 'p6', type: 'checkbox', content: 'Write integration tests', checked: false },
        { id: 'p7', type: 'checkbox', content: 'Deploy to production', checked: false },
      ]},
    ],
  },
  { id: 'research', title: 'Research', color: 'var(--cat-personal-bg)', textColor: 'var(--cat-personal-text)', description: 'Reading notes, ideas, and experiments', children: [] },
];

const SLASH_COMMANDS = [
  { group: 'Blocks', type: 'p',        label: 'Text',        desc: 'Plain paragraph',       icon: '¶' },
  { group: 'Blocks', type: 'h1',       label: 'Heading 1',   desc: 'Large section header',  icon: 'H1' },
  { group: 'Blocks', type: 'h2',       label: 'Heading 2',   desc: 'Medium header',         icon: 'H2' },
  { group: 'Blocks', type: 'bullet',   label: 'Bullet List', desc: 'Unordered list item',   icon: '•' },
  { group: 'Blocks', type: 'checkbox', label: 'Checkbox',    desc: 'To-do item',            icon: '☐' },
  { group: 'Blocks', type: 'divider',  label: 'Divider',     desc: 'Horizontal rule',       icon: '─' },
];

function SlashMenu({ query, onSelect, position }: { query: string; onSelect: (t: string | null) => void; position: { x: number; y: number } }) {
  const filtered = SLASH_COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (filtered[active]) onSelect(filtered[active].type); }
      if (e.key === 'Escape')    onSelect(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, active, onSelect]);
  if (!filtered.length) return null;
  return (
    <div style={{ position: 'fixed', left: position.x, top: position.y + 24, background: 'var(--bg-alt)', borderRadius: 10, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', width: 240, zIndex: 500, overflow: 'hidden', padding: 4 }}>
      {filtered.map((cmd, i) => (
        <div key={cmd.type} onClick={() => onSelect(cmd.type)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 6, cursor: 'pointer', background: i === active ? 'var(--accent-lighter)' : 'transparent', transition: 'background var(--trans-fast)' }}
          onMouseEnter={() => setActive(i)}>
          <div style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>{cmd.icon}</div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{cmd.label}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{cmd.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ block, onChange, onEnter, onDelete, onFocus, focused }: {
  block: NoteBlock; onChange: (c: Partial<NoteBlock>) => void;
  onEnter: (type?: string) => void; onDelete: () => void; onFocus: () => void; focused: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [slashMenu, setSlashMenu] = useState<{ x: number; y: number; query: string } | null>(null);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.innerText = block.content;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.type]);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.focus();
      const r = document.createRange(), s = window.getSelection();
      r.selectNodeContents(ref.current); r.collapse(false);
      s?.removeAllRanges(); s?.addRange(r);
    }
  }, [focused]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    const val = (e.currentTarget as HTMLDivElement).innerText;
    if (val.startsWith('/')) {
      const rect = ref.current!.getBoundingClientRect();
      setSlashMenu({ x: rect.left, y: rect.top, query: val.slice(1) });
    } else {
      setSlashMenu(null);
    }
    onChange({ content: val });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (slashMenu) return;
      const content = ref.current?.innerText || '';
      if (!content && (block.type === 'bullet' || block.type === 'checkbox')) {
        onChange({ type: 'p' });
        return;
      }
      onEnter(block.type);
    }
    if (e.key === 'Backspace' && (!ref.current?.innerText || ref.current?.innerText === '\n')) { e.preventDefault(); onDelete(); }
  }

  function handleSlashSelect(type: string | null) {
    setSlashMenu(null);
    if (!type) { onChange({ content: '' }); if (ref.current) ref.current.innerText = ''; return; }
    onChange({ type, content: '' });
    if (ref.current) ref.current.innerText = '';
    setTimeout(() => ref.current?.focus(), 0);
  }

  const blockStyles: Record<string, React.CSSProperties> = {
    p:        { fontSize: '1rem', lineHeight: 1.75, minHeight: '1.75rem', color: 'var(--text-primary)' },
    h1:       { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 4 },
    h2:       { fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-secondary)', marginTop: 12 },
    h3:       { fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-secondary)', marginTop: 8 },
    bullet:   { fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-primary)' },
    checkbox: { fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-primary)' },
  };

  const style = blockStyles[block.type] || blockStyles.p;
  const placeholder = block.type === 'p' ? "Type '/' for commands…" : block.type.startsWith('h') ? block.type.replace('h', 'Heading ') : '';

  const editable = block.type !== 'divider' ? (
    <div ref={ref} contentEditable suppressContentEditableWarning
      onInput={handleInput} onKeyDown={handleKeyDown}
      onFocus={() => onFocus()}
      style={{ outline: 'none', wordBreak: 'break-word', ...style }}
      data-placeholder={placeholder}
    />
  ) : null;

  let innerContent: React.ReactNode;
  if (block.type === 'divider') {
    innerContent = <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />;
  } else if (block.type === 'checkbox') {
    innerContent = (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '2px 0' }}>
        <div onClick={() => onChange({ checked: !block.checked })} style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid var(--accent)', background: block.checked ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 4, transition: 'all var(--trans-fast)' }}>
          {block.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
        <div style={{ flex: 1, textDecoration: block.checked ? 'line-through' : 'none', color: block.checked ? 'var(--text-muted)' : 'var(--text-primary)', opacity: block.checked ? 0.65 : 1 }}>
          {editable}
        </div>
      </div>
    );
  } else if (block.type === 'bullet') {
    innerContent = (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '1px 0' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 11, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>{editable}</div>
      </div>
    );
  } else {
    innerContent = editable;
  }

  return (
    <div
      style={{ position: 'relative', padding: block.type === 'divider' ? '8px 0' : undefined }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {block.type !== 'divider' && (
        <div style={{
          position: 'absolute', left: -30, top: block.type === 'h1' ? 20 : block.type === 'h2' ? 16 : 2,
          opacity: hovering || menuOpen ? 1 : 0, transition: 'opacity 0.12s',
          pointerEvents: hovering || menuOpen ? 'auto' : 'none',
        }}>
          <button
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); setMenuOpen(m => !m); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 3px', borderRadius: 4, display: 'flex', alignItems: 'center', lineHeight: 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="7" cy="5" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="7" cy="19" r="2"/>
              <circle cx="15" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="15" cy="19" r="2"/>
            </svg>
          </button>
        </div>
      )}
      {menuOpen && (
        <div onMouseDown={e => e.stopPropagation()} style={{ position: 'absolute', left: -30, top: '100%', zIndex: 600, background: 'var(--bg-alt)', borderRadius: 10, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', width: 200, padding: 4 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', padding: '2px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Turn into</div>
          {SLASH_COMMANDS.filter(c => c.type !== 'divider').map(cmd => (
            <div key={cmd.type}
              onMouseDown={e => { e.preventDefault(); onChange({ type: cmd.type }); setMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, cursor: 'pointer', background: block.type === cmd.type ? 'var(--accent-lighter)' : 'transparent', fontSize: '0.82rem', color: 'var(--text-secondary)', transition: 'background var(--trans-fast)' }}
              onMouseEnter={e => { if (block.type !== cmd.type) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = block.type === cmd.type ? 'var(--accent-lighter)' : 'transparent'; }}
            >
              <span style={{ width: 20, textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{cmd.icon}</span>
              {cmd.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
            <div
              onMouseDown={e => { e.preventDefault(); onDelete(); setMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', color: '#e05c5c', transition: 'background var(--trans-fast)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Delete block
            </div>
          </div>
        </div>
      )}
      {innerContent}
      {slashMenu && <SlashMenu query={slashMenu.query} onSelect={handleSlashSelect} position={slashMenu} />}
    </div>
  );
}

function BlockEditor({ blocks, setBlocks, title, setTitle }: { blocks: NoteBlock[]; setBlocks: (b: NoteBlock[]) => void; title: string; setTitle: (t: string) => void }) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (titleRef.current) titleRef.current.innerText = title; }, []);

  function updateBlock(id: string, changes: Partial<NoteBlock>) { setBlocks(blocks.map(b => b.id === id ? { ...b, ...changes } : b)); }
  function insertAfter(id: string, type?: string) {
    const idx = blocks.findIndex(b => b.id === id);
    const inheritType = (type === 'bullet' || type === 'checkbox') ? type : 'p';
    const nb: NoteBlock = { id: makeId(), type: inheritType, content: '', checked: false };
    const next = [...blocks]; next.splice(idx + 1, 0, nb);
    setTimeout(() => setFocusedId(nb.id), 10);
    setBlocks(next);
  }
  function deleteBlock(id: string) {
    if (blocks.length <= 1) return;
    const idx = blocks.findIndex(b => b.id === id);
    const next = blocks.filter(b => b.id !== id);
    setFocusedId(next[Math.max(0, idx - 1)]?.id ?? null);
    setBlocks(next);
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div ref={titleRef} contentEditable suppressContentEditableWarning
        onInput={e => setTitle((e.currentTarget as HTMLDivElement).innerText)}
        style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-secondary)', outline: 'none', marginBottom: 32, minHeight: '2.4rem', wordBreak: 'break-word' }}
        data-placeholder="Untitled"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {blocks.map(block => (
          <Block key={block.id} block={block} focused={focusedId === block.id}
            onFocus={() => setFocusedId(block.id)}
            onChange={ch => updateBlock(block.id, ch)}
            onEnter={type => insertAfter(block.id, type)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </div>
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:var(--text-muted);pointer-events:none;opacity:0.4}`}</style>
    </div>
  );
}

function QuickNoteEditor({ note, onBack, onSave }: { note: QuickNote; onBack: () => void; onSave: (n: QuickNote) => void }) {
  const [blocks, setBlocks] = useState<NoteBlock[]>(note.blocks?.length ? note.blocks : [{ id: makeId(), type: 'p', content: '' }]);
  const [title, setTitle] = useState(note.title === 'Untitled' ? '' : note.title);
  useEffect(() => { onSave({ ...note, title: title || 'Untitled', blocks }); }, [title, blocks]);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', padding: 0, transition: 'color var(--trans-fast)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Quick Notes
        </button>
        <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>/</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{title || 'Untitled'}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <BlockEditor blocks={blocks} setBlocks={setBlocks} title={title} setTitle={setTitle} />
      </div>
    </div>
  );
}

function QuickNotesBlock({ quickNotes, setQuickNotes, onOpenNote }: { quickNotes: QuickNote[]; setQuickNotes: React.Dispatch<React.SetStateAction<QuickNote[]>>; onOpenNote: (n: QuickNote) => void }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? quickNotes : quickNotes.slice(0, 4);

  function newNote() {
    const note: QuickNote = { id: makeId(), title: 'Untitled', blocks: [{ id: makeId(), type: 'p', content: '' }], createdAt: new Date() };
    setQuickNotes(prev => [note, ...prev]);
    onOpenNote(note);
  }

  return (
    <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Quick Notes</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '1px 7px', borderRadius: 10 }}>{quickNotes.length}</span>
        </div>
        <button onClick={newNote} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--accent-lighter)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', padding: '5px 10px', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-ui)', transition: 'background var(--trans-fast)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-lighter)')}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New note
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {visible.map(n => (
          <div key={n.id} onClick={() => onOpenNote(n)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 6, cursor: 'pointer', transition: 'background var(--trans-fast)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{timeAgo(n.createdAt)}</span>
          </div>
        ))}
        {quickNotes.length === 0 && <div style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No quick notes yet — click &quot;New note&quot; to start.</div>}
      </div>
      {quickNotes.length > 4 && (
        <button onClick={() => setExpanded(e => !e)} style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'var(--font-ui)', fontWeight: 500, padding: '4px 8px' }}>
          {expanded ? '↑ Show less' : `↓ Show all ${quickNotes.length} notes`}
        </button>
      )}
    </div>
  );
}

function NotebookCard({ notebook, onClick }: { notebook: Notebook; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const icon = NB_ICONS[notebook.id] || NB_ICONS.default;
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderLeft: hovered ? '3px solid var(--accent)' : '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', cursor: 'pointer', boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-sm)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'all var(--trans-normal)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: notebook.color, color: notebook.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{notebook.title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>{notebook.description}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notebook.children.length} {notebook.children.length === 1 ? 'page' : 'pages'}</div>
    </div>
  );
}

function TreeItem({ item, depth = 0, onOpen, expandedIds, toggleExpand }: { item: NotebookSection | NotebookPage; depth?: number; onOpen: (n: NotebookPage) => void; expandedIds: string[]; toggleExpand: (id: string) => void }) {
  const hasChildren = 'children' in item && item.children.length > 0;
  const isExpanded = expandedIds.includes(item.id);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `5px 8px 5px ${8 + depth * 14}px`, borderRadius: 5, cursor: 'pointer', transition: 'background var(--trans-fast)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        onClick={() => item.type === 'note' ? onOpen(item as NotebookPage) : toggleExpand(item.id)}>
        <span style={{ width: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--trans-fast)', opacity: hasChildren ? 1 : 0 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        </span>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.type === 'note' ? <FileIcon /> : <FolderIcon />}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
      </div>
      {hasChildren && isExpanded && 'children' in item && item.children.map(child => (
        <TreeItem key={child.id} item={child} depth={depth + 1} onOpen={onOpen} expandedIds={expandedIds} toggleExpand={toggleExpand} />
      ))}
    </div>
  );
}

function NotePageView({ note, breadcrumb }: { note: NotebookPage; breadcrumb: { label: string; onClick?: () => void }[] }) {
  const [blocks, setBlocks] = useState<NoteBlock[]>(note.blocks || [{ id: makeId(), type: 'p', content: '' }]);
  const [title, setTitle] = useState(note.title);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {breadcrumb.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/</span>}
            <button onClick={c.onClick} style={{ background: 'none', border: 'none', cursor: c.onClick ? 'pointer' : 'default', color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', fontWeight: i === breadcrumb.length - 1 ? 500 : 400, padding: '2px 4px', borderRadius: 4 }}>
              {c.label}
            </button>
          </span>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <BlockEditor blocks={blocks} setBlocks={setBlocks} title={title} setTitle={setTitle} />
      </div>
    </div>
  );
}

function NotebookView({ notebook, onBack, onOpenNote }: { notebook: Notebook; onBack: () => void; onOpenNote: (n: NotebookPage) => void }) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const toggle = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-ui)', padding: '5px 8px', borderRadius: 5, width: '100%', transition: 'color var(--trans-fast), background var(--trans-fast)' };
  const icon = NB_ICONS[notebook.id] || NB_ICONS.default;
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 220, borderRight: '1px solid var(--border)', padding: '16px 8px', flexShrink: 0, overflowY: 'auto', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onBack} style={{ ...btnStyle, marginBottom: 12 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Notes
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 10px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: notebook.color, color: notebook.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
          {notebook.title}
        </div>
        <div style={{ flex: 1 }}>
          {notebook.children.map(item => <TreeItem key={item.id} item={item} onOpen={onOpenNote} expandedIds={expandedIds} toggleExpand={toggle} />)}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: notebook.color, color: notebook.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{notebook.title}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select a page from the sidebar to open it.</div>
      </div>
    </div>
  );
}

type View =
  | { type: 'home' }
  | { type: 'quicknote'; data: QuickNote }
  | { type: 'notebook'; data: Notebook }
  | { type: 'note'; data: NotebookPage; notebook: Notebook };

export default function NotesPage() {
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(INITIAL_QUICK_NOTES);
  const [notebooks] = useState<Notebook[]>(INITIAL_NOTEBOOKS);
  const [view, setView] = useState<View>({ type: 'home' });
  const [breadcrumb, setBreadcrumb] = useState<{ label: string; onClick?: () => void }[]>([]);
  const [search, setSearch] = useState('');

  function openQuickNote(note: QuickNote) { setView({ type: 'quicknote', data: note }); }
  function updateQuickNote(updated: QuickNote) { setQuickNotes(prev => prev.map(n => n.id === updated.id ? updated : n)); }
  function openNotebook(nb: Notebook) {
    setView({ type: 'notebook', data: nb });
    setBreadcrumb([{ label: 'Notes', onClick: () => setView({ type: 'home' }) }, { label: nb.title }]);
  }
  function openNote(note: NotebookPage, nb: Notebook) {
    setView({ type: 'note', data: note, notebook: nb });
    setBreadcrumb([{ label: 'Notes', onClick: () => setView({ type: 'home' }) }, { label: nb.title, onClick: () => openNotebook(nb) }, { label: note.title }]);
  }

  if (view.type === 'quicknote') return <QuickNoteEditor note={view.data} onBack={() => setView({ type: 'home' })} onSave={updateQuickNote} />;
  if (view.type === 'note') return <NotePageView note={view.data} breadcrumb={breadcrumb} />;
  if (view.type === 'notebook') return <NotebookView notebook={view.data} onBack={() => setView({ type: 'home' })} onOpenNote={note => openNote(note, view.data)} />;

  const filteredNotebooks = search ? notebooks.filter(nb => nb.title.toLowerCase().includes(search.toLowerCase())) : notebooks;
  const filteredQuickNotes = search ? quickNotes.filter(n => n.title.toLowerCase().includes(search.toLowerCase())) : quickNotes;

  return (
    <div className="content-inner">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Private</div>
        <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Notes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>Quick captures and structured notebooks.</p>
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes and notebooks…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-alt)', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      <QuickNotesBlock quickNotes={filteredQuickNotes} setQuickNotes={setQuickNotes} onOpenNote={openQuickNote} />

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--text-secondary)' }}>Notebooks</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--accent-lighter)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', padding: '5px 10px', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New notebook
          </button>
        </div>
        {filteredNotebooks.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {filteredNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={() => openNotebook(nb)} />)}
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notebooks match &quot;{search}&quot;</div>
        )}
      </div>
    </div>
  );
}
