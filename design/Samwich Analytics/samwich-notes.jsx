// samwich-notes.jsx — Notes: Quick Note Pages + Notebooks + Block Editor v2

const { useState, useEffect, useRef, useCallback } = React;

/* ── Helpers ── */
function makeId() { return Math.random().toString(36).slice(2, 9); }
function timeAgo(d) {
  const diff = Date.now() - d.getTime(), m = Math.floor(diff/60000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

/* ── Inline markdown parser → safe HTML ── */
function parseInlineMd(text) {
  if (!text) return '';
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/_(.+?)_/g,'<em>$1</em>')
    .replace(/~~(.+?)~~/g,'<s>$1</s>')
    .replace(/`(.+?)`/g,'<code style="background:var(--accent-lighter);color:var(--accent);padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>');
}

/* ── Notebook Icons ── */
const NB_ICONS = {
  school:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  work:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  research: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  default:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
};
const FolderIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const FileIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

/* ── Sample Data ── */
const INITIAL_QUICK_NOTES = [
  { id: 'qn1', title: 'dbt incremental strategies', blocks: [{ id: 'b1', type: 'p', content: 'Look into dbt incremental strategies for **late-arriving data** — add a lookback window of ~3 hours.' }], createdAt: new Date(Date.now() - 1e3*60*10) },
  { id: 'qn2', title: 'Client follow-up', blocks: [{ id: 'b2', type: 'p', content: 'Follow up with client re: Q2 dashboard access. Check if Snowflake permissions are sorted.' }], createdAt: new Date(Date.now() - 1e3*60*60*2) },
  { id: 'qn3', title: 'Reading', blocks: [{ id: 'b3', type: 'p', content: 'Read: _Designing Data-Intensive Applications_ ch. 4 — encoding and evolution.' }], createdAt: new Date(Date.now() - 1e3*60*60*24) },
  { id: 'qn4', title: 'Airflow timeout issue', blocks: [{ id: 'b4', type: 'p', content: 'DAG timeout issue — check executor logs. Possibly `KubernetesPodOperator` hitting memory limit.' }], createdAt: new Date(Date.now() - 1e3*60*60*48) },
];

const INITIAL_NOTEBOOKS = [
  { id: 'school', title: 'School', color: 'var(--cat-study-bg)', textColor: 'var(--cat-study-text)', description: 'Courses, lectures, and assignments',
    children: [
      { id: 'fall-2025', title: 'Fall 2025', type: 'section', children: [
        { id: 'cs301', title: 'CS 301 — Databases', type: 'note', blocks: [
          { id: 'b1', type: 'h1', content: 'CS 301 — Database Systems' },
          { id: 'b2', type: 'p', content: 'Professor: Dr. Nguyen  ·  MWF 10:00am' },
          { id: 'b3', type: 'h2', content: 'Week 3: Normalization' },
          { id: 'b4', type: 'bullet', content: '**1NF** — no repeating groups, atomic values' },
          { id: 'b5', type: 'bullet', content: '**2NF** — remove partial dependencies' },
          { id: 'b6', type: 'bullet', content: '**3NF** — remove transitive dependencies' },
          { id: 'b7', type: 'checkbox', content: 'Complete problem set 2', checked: true },
          { id: 'b8', type: 'checkbox', content: 'Review ER diagram lecture slides', checked: false },
        ]},
        { id: 'stat401', title: 'STAT 401 — Regression', type: 'note', blocks: [{ id: 'c1', type: 'h1', content: 'STAT 401 — Applied Regression' }, { id: 'c2', type: 'p', content: 'Notes and assignments.' }]},
      ]},
    ],
  },
  { id: 'work', title: 'Work Projects', color: 'var(--cat-work-bg)', textColor: 'var(--cat-work-text)', description: 'Client work, pipelines, and dashboards',
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

/* ── Slash Command Menu ── */
const SLASH_COMMANDS = [
  { group: 'Blocks', type: 'p',        label: 'Text',        desc: 'Plain paragraph',       icon: '¶' },
  { group: 'Blocks', type: 'h1',       label: 'Heading 1',   desc: 'Large section header',  icon: 'H1' },
  { group: 'Blocks', type: 'h2',       label: 'Heading 2',   desc: 'Medium header',         icon: 'H2' },
  { group: 'Blocks', type: 'h3',       label: 'Heading 3',   desc: 'Small header',          icon: 'H3' },
  { group: 'Blocks', type: 'bullet',   label: 'Bullet List', desc: 'Unordered list item',   icon: '•' },
  { group: 'Blocks', type: 'checkbox', label: 'Checkbox',    desc: 'To-do item',            icon: '☐' },
  { group: 'Blocks', type: 'divider',  label: 'Divider',     desc: 'Horizontal rule',       icon: '─' },
  { group: 'Blocks', type: 'table',    label: 'Table',       desc: 'Simple table',          icon: '⊞' },
  { group: 'Inline', type: '__bold',   label: 'Bold',        desc: 'Insert **bold** text',  icon: 'B' },
  { group: 'Inline', type: '__italic', label: 'Italic',      desc: 'Insert _italic_ text',  icon: 'I' },
  { group: 'Inline', type: '__strike', label: 'Strikethrough',desc: 'Insert ~~text~~',      icon: 'S̶' },
  { group: 'Inline', type: '__code',   label: 'Inline Code', desc: 'Insert `code`',         icon: '<>' },
];

function SlashMenu({ query, onSelect, position }) {
  const filtered = SLASH_COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a+1, filtered.length-1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a-1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (filtered[active]) onSelect(filtered[active].type); }
      if (e.key === 'Escape')    onSelect(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, active, onSelect]);
  if (!filtered.length) return null;
  const groups = [...new Set(filtered.map(c => c.group))];
  return (
    <div style={{ position:'fixed', left:position.x, top:position.y+24, background:'var(--bg-alt)', borderRadius:10, boxShadow:'var(--shadow)', border:'1px solid var(--border)', width:270, zIndex:500, overflow:'hidden', padding:4 }}>
      {groups.map(g => (
        <div key={g}>
          <div style={{ padding:'6px 10px 4px', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', color:'var(--text-muted)', textTransform:'uppercase' }}>{g}</div>
          {filtered.filter(c=>c.group===g).map((cmd,i) => {
            const gi = filtered.indexOf(cmd);
            return (
              <div key={cmd.type} onClick={() => onSelect(cmd.type)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 10px', borderRadius:6, cursor:'pointer', background: gi===active ? 'var(--accent-lighter)' : 'transparent', transition:'background var(--trans-fast)' }}
                onMouseEnter={() => setActive(gi)}>
                <div style={{ width:26, height:26, borderRadius:6, border:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', flexShrink:0 }}>{cmd.icon}</div>
                <div>
                  <div style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--text-secondary)' }}>{cmd.label}</div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{cmd.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── Block ── */
function Block({ block, onChange, onEnter, onDelete, onFocus, focused }) {
  const ref = useRef();
  const [slashMenu, setSlashMenu] = useState(null);
  const [localFocused, setLocalFocused] = useState(false);

  useEffect(() => { if (focused && ref.current) { ref.current.focus(); const r = document.createRange(), s = window.getSelection(); r.selectNodeContents(ref.current); r.collapse(false); s.removeAllRanges(); s.addRange(r); } }, [focused]);

  function insertInline(marker) {
    if (!ref.current) return;
    const el = ref.current;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const markers = { __bold: ['**','**'], __italic: ['_','_'], __strike: ['~~','~~'], __code: ['`','`'] };
      const [open, close] = markers[marker] || ['',''];
      const text = document.createTextNode(open + (sel.toString() || 'text') + close);
      range.deleteContents();
      range.insertNode(text);
    }
    const newContent = el.innerText;
    onChange({ content: newContent });
    setSlashMenu(null);
    el.focus();
  }

  function handleInput(e) {
    const val = e.currentTarget.innerText;
    if (val.startsWith('/')) {
      const rect = ref.current.getBoundingClientRect();
      setSlashMenu({ x: rect.left, y: rect.top, query: val.slice(1) });
    } else {
      setSlashMenu(null);
    }
    onChange({ content: val });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (slashMenu) return;
      onEnter();
    }
    if (e.key === 'Backspace' && (ref.current?.innerText === '' || ref.current?.innerText === '\n')) {
      e.preventDefault(); onDelete();
    }
  }

  function handleSlashSelect(type) {
    setSlashMenu(null);
    if (!type) { onChange({ content: '' }); if (ref.current) ref.current.innerText = ''; return; }
    if (type.startsWith('__')) { insertInline(type); return; }
    onChange({ type, content: '' });
    if (ref.current) { ref.current.innerText = ''; ref.current.focus(); }
  }

  const blockStyles = {
    p:  { fontSize:'1rem', lineHeight:1.75, minHeight:'1.75rem', color:'var(--text-primary)' },
    h1: { fontSize:'1.75rem', fontWeight:700, lineHeight:1.3, color:'var(--text-secondary)', marginTop:16, marginBottom:4 },
    h2: { fontSize:'1.3rem', fontWeight:600, lineHeight:1.4, color:'var(--text-secondary)', marginTop:12 },
    h3: { fontSize:'1.05rem', fontWeight:600, lineHeight:1.5, color:'var(--text-secondary)', marginTop:8 },
    bullet:   { fontSize:'1rem', lineHeight:1.75, color:'var(--text-primary)' },
    checkbox: { fontSize:'1rem', lineHeight:1.75, color:'var(--text-primary)' },
  };

  if (block.type === 'divider') return <div style={{ padding:'8px 0' }}><hr style={{ border:'none', borderTop:'1px solid var(--border)' }} /></div>;

  if (block.type === 'table') return (
    <div style={{ overflowX:'auto', margin:'8px 0' }}>
      <table style={{ borderCollapse:'collapse', width:'100%', fontSize:'0.9rem' }}>
        <tbody>
          {[['Column A','Column B','Column C'],['','',''],['','','']].map((row,ri) => (
            <tr key={ri}>{row.map((cell,ci) => (
              <td key={ci} contentEditable suppressContentEditableWarning style={{ border:'1px solid var(--border)', padding:'6px 10px', minWidth:100, outline:'none', background: ri===0 ? 'var(--bg-hover)' : 'var(--bg-alt)', fontWeight: ri===0 ? 600 : 400, color:'var(--text-primary)' }}>{cell}</td>
            ))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* Rendered (non-focused) block with markdown parsed */
  const renderedBlock = (
    <div
      dangerouslySetInnerHTML={{ __html: parseInlineMd(block.content) || `<span style="opacity:0.35">${block.type === 'p' ? "Type '/' for commands…" : block.type.toUpperCase()}</span>` }}
      onClick={() => { setLocalFocused(true); onFocus(); }}
      style={{ cursor:'text', outline:'none', wordBreak:'break-word', ...blockStyles[block.type] || blockStyles.p }}
    />
  );

  /* Editable block */
  const editableBlock = (
    <div ref={ref} contentEditable suppressContentEditableWarning
      onInput={handleInput} onKeyDown={handleKeyDown}
      onFocus={() => { setLocalFocused(true); onFocus(); }}
      onBlur={() => setLocalFocused(false)}
      style={{ outline:'none', wordBreak:'break-word', ...blockStyles[block.type] || blockStyles.p }}
      data-placeholder={block.type === 'p' ? "Type '/' for commands…" : block.type.toUpperCase()}>
      {block.content}
    </div>
  );

  if (block.type === 'checkbox') return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'2px 0' }}>
      <div onClick={() => onChange({ checked: !block.checked })} style={{ width:18, height:18, borderRadius:4, border:'2px solid var(--accent)', background: block.checked ? 'var(--accent)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, marginTop:4, transition:'all var(--trans-fast)' }}>
        {block.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <div style={{ flex:1, textDecoration: block.checked ? 'line-through' : 'none', color: block.checked ? 'var(--text-muted)' : 'var(--text-primary)', opacity: block.checked ? 0.65 : 1 }}>
        {localFocused || focused ? editableBlock : renderedBlock}
      </div>
      {slashMenu && <SlashMenu query={slashMenu.query} onSelect={handleSlashSelect} position={slashMenu} />}
    </div>
  );

  if (block.type === 'bullet') return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'1px 0' }}>
      <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', marginTop:11, flexShrink:0 }} />
      <div style={{ flex:1 }}>{localFocused || focused ? editableBlock : renderedBlock}</div>
      {slashMenu && <SlashMenu query={slashMenu.query} onSelect={handleSlashSelect} position={slashMenu} />}
    </div>
  );

  return (
    <div style={{ position:'relative' }}>
      {localFocused || focused ? editableBlock : renderedBlock}
      {slashMenu && <SlashMenu query={slashMenu.query} onSelect={handleSlashSelect} position={slashMenu} />}
    </div>
  );
}

/* ── Block Editor ── */
function BlockEditor({ blocks, setBlocks, title, setTitle }) {
  const [focusedId, setFocusedId] = useState(null);

  function updateBlock(id, changes) { setBlocks(prev => prev.map(b => b.id===id ? {...b,...changes} : b)); }
  function insertAfter(id) {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id===id);
      const nb = { id:makeId(), type:'p', content:'' };
      const next = [...prev]; next.splice(idx+1, 0, nb);
      setTimeout(() => setFocusedId(nb.id), 10);
      return next;
    });
  }
  function deleteBlock(id) {
    setBlocks(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(b => b.id===id);
      const next = prev.filter(b => b.id!==id);
      setFocusedId(next[Math.max(0,idx-1)]?.id);
      return next;
    });
  }

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 32px 80px' }}>
      <div contentEditable suppressContentEditableWarning
        onInput={e => setTitle(e.currentTarget.innerText)}
        style={{ fontSize:'2rem', fontWeight:700, lineHeight:1.2, color:'var(--text-secondary)', outline:'none', marginBottom:32, minHeight:'2.4rem', wordBreak:'break-word' }}
        data-placeholder="Untitled">
        {title}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {blocks.map(block => (
          <Block key={block.id} block={block} focused={focusedId===block.id}
            onFocus={() => setFocusedId(block.id)}
            onChange={ch => updateBlock(block.id, ch)}
            onEnter={() => insertAfter(block.id)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </div>
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:var(--text-muted);pointer-events:none;opacity:0.4}`}</style>
    </div>
  );
}

/* ── Quick Note Page View (lightweight editor) ── */
function QuickNoteEditor({ note, onBack, onSave }) {
  const [blocks, setBlocks] = useState(note.blocks?.length ? note.blocks : [{ id:makeId(), type:'p', content:'' }]);
  const [title, setTitle] = useState(note.title === 'Untitled' ? '' : note.title);
  useEffect(() => { onSave({ ...note, title: title || 'Untitled', blocks }); }, [title, blocks]);
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'14px 32px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.8rem', fontFamily:'var(--font-ui)', padding:0, transition:'color var(--trans-fast)' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Quick Notes
        </button>
        <span style={{ color:'var(--border)', fontSize:'0.8rem' }}>/</span>
        <span style={{ fontSize:'0.8rem', color:'var(--text-primary)', fontWeight:500 }}>{title || 'Untitled'}</span>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        <BlockEditor blocks={blocks} setBlocks={setBlocks} title={title} setTitle={setTitle} />
      </div>
    </div>
  );
}

/* ── Quick Notes Block ── */
function QuickNotesBlock({ quickNotes, setQuickNotes, onOpenNote }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? quickNotes : quickNotes.slice(0, 4);

  function newNote() {
    const note = { id:makeId(), title:'Untitled', blocks:[{ id:makeId(), type:'p', content:'' }], createdAt:new Date() };
    setQuickNotes(prev => [note, ...prev]);
    onOpenNote(note);
  }

  return (
    <div style={{ background:'var(--bg-alt)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'20px', marginBottom:32 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style={{ fontWeight:600, fontSize:'0.95rem', color:'var(--text-secondary)' }}>Quick Notes</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', background:'var(--bg-hover)', padding:'1px 7px', borderRadius:10 }}>{quickNotes.length}</span>
        </div>
        <button onClick={newNote} style={{ display:'flex', alignItems:'center', gap:5, background:'var(--accent-lighter)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer', padding:'5px 10px', color:'var(--accent)', fontSize:'0.78rem', fontWeight:500, fontFamily:'var(--font-ui)', transition:'background var(--trans-fast)' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--accent-light)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--accent-lighter)'}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New note
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        {visible.map(n => (
          <div key={n.id} onClick={() => onOpenNote(n)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 8px', borderRadius:6, cursor:'pointer', transition:'background var(--trans-fast)' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{ flex:1, fontSize:'0.875rem', color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title || 'Untitled'}</span>
            <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', flexShrink:0 }}>{timeAgo(n.createdAt)}</span>
          </div>
        ))}
        {quickNotes.length === 0 && (
          <div style={{ padding:'16px 8px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>
            No quick notes yet — click "New note" to start.
          </div>
        )}
      </div>

      {quickNotes.length > 4 && (
        <button onClick={() => setExpanded(e=>!e)} style={{ marginTop:10, background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontSize:'0.78rem', fontFamily:'var(--font-ui)', fontWeight:500, padding:'4px 8px', borderRadius:5, transition:'background var(--trans-fast)' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--accent-lighter)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          {expanded ? '↑ Show less' : `↓ Show all ${quickNotes.length} notes`}
        </button>
      )}
    </div>
  );
}

/* ── Notebook Card ── */
function NotebookCard({ notebook, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{ background:'var(--bg-alt)', border:'1px solid var(--border)', borderLeft: hovered ? '3px solid var(--accent)' : '1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'18px 20px', cursor:'pointer', boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-sm)', transform: hovered ? 'translateY(-2px)' : 'none', transition:'all var(--trans-normal)' }}>
      <div style={{ width:36, height:36, borderRadius:8, background:notebook.color, color:notebook.textColor, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
        {NB_ICONS[notebook.id] || NB_ICONS.default}
      </div>
      <div style={{ fontWeight:600, fontSize:'1rem', color:'var(--text-secondary)', marginBottom:4 }}>{notebook.title}</div>
      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:10, lineHeight:1.4 }}>{notebook.description}</div>
      <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{notebook.children.length} {notebook.children.length===1?'page':'pages'}</div>
    </div>
  );
}

/* ── Tree Item ── */
function TreeItem({ item, depth=0, onOpen, expandedIds, toggleExpand }) {
  const hasChildren = item.children?.length > 0;
  const isExpanded = expandedIds.includes(item.id);
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:`5px 8px 5px ${8+depth*14}px`, borderRadius:5, cursor:'pointer', transition:'background var(--trans-fast)' }}
        onMouseEnter={e=>e.currentTarget.style.background='var(--sidebar-item-hover)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        onClick={() => item.type==='note' ? onOpen(item) : toggleExpand(item.id)}>
        <span style={{ width:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--text-muted)', transform: isExpanded?'rotate(90deg)':'none', transition:'transform var(--trans-fast)', opacity: hasChildren?1:0 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        </span>
        <span style={{ color:'var(--text-muted)', display:'flex', alignItems:'center', flexShrink:0 }}>{item.type==='note' ? <FileIcon/> : <FolderIcon/>}</span>
        <span style={{ fontSize:'0.8rem', color:'var(--text-primary)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</span>
      </div>
      {hasChildren && isExpanded && item.children.map(child => (
        <TreeItem key={child.id} item={child} depth={depth+1} onOpen={onOpen} expandedIds={expandedIds} toggleExpand={toggleExpand} />
      ))}
    </div>
  );
}

/* ── Note Page View (notebook) ── */
function NotePageView({ note, breadcrumb }) {
  const [blocks, setBlocks] = useState(note.blocks || [{ id:makeId(), type:'p', content:'' }]);
  const [title, setTitle] = useState(note.title);
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'14px 32px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
        {breadcrumb.map((c,i) => (
          <React.Fragment key={i}>
            {i>0 && <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>/</span>}
            <button onClick={c.onClick} style={{ background:'none', border:'none', cursor: c.onClick?'pointer':'default', color: i===breadcrumb.length-1?'var(--text-primary)':'var(--text-muted)', fontSize:'0.8rem', fontFamily:'var(--font-ui)', fontWeight: i===breadcrumb.length-1?500:400, padding:'2px 4px', borderRadius:4, transition:'color var(--trans-fast)' }}
              onMouseEnter={e=>{ if(c.onClick&&i<breadcrumb.length-1) e.currentTarget.style.color='var(--accent)'; }}
              onMouseLeave={e=>e.currentTarget.style.color = i===breadcrumb.length-1?'var(--text-primary)':'var(--text-muted)'}>
              {c.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        <BlockEditor blocks={blocks} setBlocks={setBlocks} title={title} setTitle={setTitle} />
      </div>
    </div>
  );
}

/* ── Notebook View ── */
function NotebookView({ notebook, onBack, onOpenNote }) {
  const [expandedIds, setExpandedIds] = useState([]);
  const toggle = id => setExpandedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const btnStyle = { display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.75rem', fontFamily:'var(--font-ui)', padding:'5px 8px', borderRadius:5, width:'100%', transition:'color var(--trans-fast), background var(--trans-fast)' };
  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      <div style={{ width:220, borderRight:'1px solid var(--border)', padding:'16px 8px', flexShrink:0, overflowY:'auto', background:'var(--sidebar-bg)', display:'flex', flexDirection:'column' }}>
        <button onClick={onBack} style={{...btnStyle, marginBottom:12}} onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Notes
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 8px 10px', fontWeight:600, fontSize:'0.85rem', color:'var(--text-secondary)' }}>
          <div style={{ width:22, height:22, borderRadius:5, background:notebook.color, color:notebook.textColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{NB_ICONS[notebook.id]||NB_ICONS.default}</div>
          {notebook.title}
        </div>
        <div style={{ flex:1 }}>{notebook.children.map(item => <TreeItem key={item.id} item={item} onOpen={onOpenNote} expandedIds={expandedIds} toggleExpand={toggle} />)}</div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:8, marginTop:8, display:'flex', flexDirection:'column', gap:2 }}>
          {[{icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>, label:'New page'},{icon:<FolderIcon/>, label:'Add folder'}].map(a => (
            <button key={a.label} style={btnStyle}
              onMouseEnter={e=>{e.currentTarget.style.color='var(--accent)';e.currentTarget.style.background='var(--sidebar-item-hover)';}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.background='transparent';}}>{a.icon}{a.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'var(--text-muted)' }}>
        <div style={{ width:48, height:48, borderRadius:12, background:notebook.color, color:notebook.textColor, display:'flex', alignItems:'center', justifyContent:'center' }}>{React.cloneElement(NB_ICONS[notebook.id]||NB_ICONS.default,{width:24,height:24})}</div>
        <div style={{ fontSize:'1.1rem', fontWeight:600, color:'var(--text-secondary)' }}>{notebook.title}</div>
        <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Select a page from the sidebar to open it.</div>
      </div>
    </div>
  );
}

/* ── Search Bar ── */
function NotesSearch({ query, setQuery }) {
  return (
    <div style={{ position:'relative', marginBottom:28 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search notes and notebooks…"
        style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg-alt)', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-ui)', outline:'none', transition:'border-color var(--trans-fast)' }}
        onFocus={e=>e.target.style.borderColor='var(--accent)'}
        onBlur={e=>e.target.style.borderColor='var(--border)'}
      />
      {query && <button onClick={()=>setQuery('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1rem', lineHeight:1 }}>×</button>}
    </div>
  );
}

/* ── Main Notes Screen ── */
function NotesScreen() {
  const [quickNotes, setQuickNotes] = useState(INITIAL_QUICK_NOTES);
  const [notebooks] = useState(INITIAL_NOTEBOOKS);
  const [view, setView] = useState({ type:'home' });
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [search, setSearch] = useState('');

  function openQuickNote(note) {
    setView({ type:'quicknote', data:note });
  }

  function updateQuickNote(updated) {
    setQuickNotes(prev => prev.map(n => n.id===updated.id ? updated : n));
  }

  function openNotebook(nb) {
    setView({ type:'notebook', data:nb });
    setBreadcrumb([{ label:'Notes', onClick:()=>setView({type:'home'}) }, { label:nb.title }]);
  }

  function openNote(note, nb) {
    setView({ type:'note', data:note, notebook:nb });
    setBreadcrumb([{ label:'Notes', onClick:()=>setView({type:'home'}) }, { label:nb.title, onClick:()=>openNotebook(nb) }, { label:note.title }]);
  }

  if (view.type === 'quicknote') {
    return <QuickNoteEditor note={view.data} onBack={()=>setView({type:'home'})} onSave={updateQuickNote} />;
  }

  if (view.type === 'note') {
    return <NotePageView note={view.data} breadcrumb={breadcrumb} />;
  }

  if (view.type === 'notebook') {
    return <NotebookView notebook={view.data} onBack={()=>setView({type:'home'})} onOpenNote={note=>openNote(note,view.data)} />;
  }

  const filteredNotebooks = search
    ? notebooks.filter(nb => nb.title.toLowerCase().includes(search.toLowerCase()) || nb.description.toLowerCase().includes(search.toLowerCase()))
    : notebooks;

  const filteredQuickNotes = search
    ? quickNotes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.blocks?.some(b=>b.content?.toLowerCase().includes(search.toLowerCase())))
    : quickNotes;

  return (
    <div className="content-inner">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.1em', color:'var(--accent)', textTransform:'uppercase', marginBottom:12 }}>Private</div>
        <h1 style={{ fontSize:'var(--text-h1)', fontWeight:600, color:'var(--text-secondary)', marginBottom:6 }}>Notes</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:20 }}>Quick captures and structured notebooks.</p>
        <NotesSearch query={search} setQuery={setSearch} />
      </div>

      <QuickNotesBlock quickNotes={filteredQuickNotes} setQuickNotes={setQuickNotes} onOpenNote={openQuickNote} />

      <div style={{ borderTop:'1px solid var(--border)', paddingTop:28, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <h2 style={{ fontSize:'var(--text-h2)', fontWeight:600, color:'var(--text-secondary)' }}>Notebooks</h2>
          <button style={{ display:'flex', alignItems:'center', gap:5, background:'var(--accent-lighter)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer', padding:'5px 10px', color:'var(--accent)', fontSize:'0.78rem', fontWeight:500, fontFamily:'var(--font-ui)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New notebook
          </button>
        </div>
        {filteredNotebooks.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:14 }}>
            {filteredNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={()=>openNotebook(nb)} />)}
          </div>
        ) : (
          <div style={{ padding:'24px 0', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>No notebooks match "{search}"</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { NotesScreen });
