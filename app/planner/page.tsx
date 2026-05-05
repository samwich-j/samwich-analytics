'use client';

import { useState, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';

const CATEGORIES = [
  { id: 'work',     label: 'Work',      catKey: 'work' },
  { id: 'study',    label: 'Study',     catKey: 'study' },
  { id: 'personal', label: 'Personal',  catKey: 'personal' },
  { id: 'health',   label: 'Health',    catKey: 'health' },
  { id: 'travel',   label: 'Travel',    catKey: 'travel' },
  { id: 'free',     label: 'Free Time', catKey: 'free' },
];

const SAMPLE_BLOCKS = [
  { id: 1, title: 'Deep Work: Dashboard Build', start: 9,    end: 11,   category: 'work' },
  { id: 2, title: 'SQL Interview Prep',          start: 11,   end: 12,   category: 'study' },
  { id: 3, title: 'Lunch + Walk',                start: 12,   end: 13,   category: 'health' },
  { id: 4, title: 'Client Meeting — Q2 Review',  start: 14,   end: 15,   category: 'work' },
  { id: 5, title: 'dbt model refactor',           start: 15.5, end: 17,   category: 'work' },
  { id: 6, title: 'Reading',                      start: 20,   end: 21,   category: 'free' },
];

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

function formatHour(h: number) {
  if (h === 12) return '12 pm';
  if (h === 0 || h === 24) return '12 am';
  return h > 12 ? `${h - 12} pm` : `${h} am`;
}

function formatTime(h: number) {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const suffix = hr >= 12 ? 'pm' : 'am';
  const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  return `${displayHr}:${min.toString().padStart(2, '0')} ${suffix}`;
}

interface Block { id: number; title: string; start: number; end: number; category: string; }

function TimeBlock({ block, hourHeight, startHour, onClick }: { block: Block; hourHeight: number; startHour: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const top = (block.start - startHour) * hourHeight;
  const height = (block.end - block.start) * hourHeight;
  const tall = height > 50;
  return (
    <div
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', left: 4, right: 4, top, height: Math.max(height - 3, 20),
        borderRadius: 6,
        background: `var(--cat-${block.category}-bg)`,
        color: `var(--cat-${block.category}-text)`,
        padding: '4px 8px', cursor: 'pointer', userSelect: 'none',
        boxShadow: hovered ? '0 3px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'box-shadow var(--trans-fast), transform var(--trans-fast)',
        transform: hovered ? 'scale(1.01)' : 'scale(1)',
        overflow: 'hidden', zIndex: 2,
      }}>
      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {block.title}
      </div>
      {tall && (
        <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
          {formatTime(block.start)} – {formatTime(block.end)}
        </div>
      )}
    </div>
  );
}

function EditBlockDialog({ block, onClose, onSave, onDelete }: {
  block: Block; onClose: () => void;
  onSave: (b: Block) => void; onDelete: (id: number) => void;
}) {
  const [title, setTitle] = useState(block.title);
  const [category, setCategory] = useState(block.category);
  const [startH, setStartH] = useState(block.start);
  const [endH, setEndH] = useState(block.end);

  function timeOptions() {
    const opts: number[] = [];
    for (let h = 6; h <= 23.5; h += 0.5) opts.push(h);
    return opts;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(30,30,15,0.45)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-alt)', borderRadius: 'var(--radius-xl)', padding: 28, width: 380, maxWidth: '95vw', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--text-secondary)' }}>Edit time block</h3>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          autoFocus
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-ui)', marginBottom: 16, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {(['start', 'end'] as const).map(type => (
            <div key={type} style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                {type === 'start' ? 'Start' : 'End'}
              </div>
              <select
                value={type === 'start' ? startH : endH}
                onChange={e => type === 'start' ? setStartH(Number(e.target.value)) : setEndH(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-ui)', outline: 'none' }}
              >
                {timeOptions().map(h => <option key={h} value={h}>{formatTime(h)}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 500,
                cursor: 'pointer', border: category === cat.id ? `2px solid var(--cat-${cat.catKey}-text)` : '2px solid transparent',
                background: `var(--cat-${cat.catKey}-bg)`, color: `var(--cat-${cat.catKey}-text)`,
                fontFamily: 'var(--font-ui)', transition: 'all var(--trans-fast)',
              }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <button
            onClick={() => onDelete(block.id)}
            style={{ padding: '9px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#e74c3c', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}
          >
            Delete
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '9px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>Cancel</button>
            <button
              onClick={() => onSave({ ...block, title, category, start: startH, end: endH })}
              style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NowIndicator({ hourHeight, startHour }: { hourHeight: number; startHour: number }) {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < startHour || h > startHour + HOURS.length) return null;
  const top = (h - startHour) * hourHeight;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, zIndex: 5, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-gold)' }} />
      <div style={{ marginLeft: 6, height: 2, background: 'var(--accent-gold)', opacity: 0.85 }} />
    </div>
  );
}

function QuickCreateDialog({ clickedHour, onClose, onSave }: {
  clickedHour: number; onClose: () => void; onSave: (b: Omit<Block, 'id'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const startH = clickedHour;
  const endH = clickedHour + 1;
  const canSave = title.trim() && category;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(30,30,15,0.45)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-alt)', borderRadius: 'var(--radius-xl)', padding: 28, width: 380, maxWidth: '95vw', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--text-secondary)' }}>New time block</h3>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What are you working on?"
          autoFocus
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-ui)', marginBottom: 16, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {(['start', 'end'] as const).map(type => (
            <div key={type} style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                {type === 'start' ? 'Start' : 'End'}
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-ui)' }}>
                {formatTime(type === 'start' ? startH : endH)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 500,
                cursor: 'pointer', border: category === cat.id ? `2px solid var(--cat-${cat.catKey}-text)` : '2px solid transparent',
                background: `var(--cat-${cat.catKey}-bg)`, color: `var(--cat-${cat.catKey}-text)`,
                fontFamily: 'var(--font-ui)', transition: 'all var(--trans-fast)',
              }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>Cancel</button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave({ title, category, start: startH, end: endH })}
            style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none', background: canSave ? 'var(--accent)' : 'var(--border)', color: canSave ? '#fff' : 'var(--text-muted)', cursor: canSave ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Create Block
          </button>
        </div>
      </div>
    </div>
  );
}

function DailyView({ blocks, setBlocks, hourHeight }: { blocks: Block[]; setBlocks: React.Dispatch<React.SetStateAction<Block[]>>; hourHeight: number }) {
  const startHour = 6;
  const [createDialog, setCreateDialog] = useState<number | null>(null);
  const [editDialog, setEditDialog] = useState<Block | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function handleGridClick(e: React.MouseEvent) {
    const rect = gridRef.current!.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = Math.floor(y / hourHeight) + startHour;
    setCreateDialog(h);
  }

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div ref={gridRef} onClick={handleGridClick} style={{ position: 'relative', minHeight: HOURS.length * hourHeight }}>
        {HOURS.map(h => (
          <div key={h} className="grid-row" style={{ position: 'absolute', top: (h - startHour) * hourHeight, left: 0, right: 0, height: hourHeight, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', paddingTop: 4, minWidth: 48, userSelect: 'none' }}>{formatHour(h)}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', top: 0, left: 52, right: 0, bottom: 0 }}>
          <NowIndicator hourHeight={hourHeight} startHour={startHour} />
          {blocks.map(b => (
            <TimeBlock key={b.id} block={b} hourHeight={hourHeight} startHour={startHour} onClick={() => setEditDialog(b)} />
          ))}
        </div>
      </div>
      {createDialog !== null && (
        <QuickCreateDialog
          clickedHour={createDialog}
          onClose={() => setCreateDialog(null)}
          onSave={block => { setBlocks(prev => [...prev, { ...block, id: Date.now() }]); setCreateDialog(null); }}
        />
      )}
      {editDialog !== null && (
        <EditBlockDialog
          block={editDialog}
          onClose={() => setEditDialog(null)}
          onSave={updated => { setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b)); setEditDialog(null); }}
          onDelete={id => { setBlocks(prev => prev.filter(b => b.id !== id)); setEditDialog(null); }}
        />
      )}
    </div>
  );
}

function WeeklyView({ hourHeight }: { hourHeight: number }) {
  const startHour = 6;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const sampleWeekBlocks = [
    { day: 0, title: 'Stand-up', start: 9, end: 9.5, category: 'work' },
    { day: 0, title: 'Sprint Planning', start: 10, end: 12, category: 'work' },
    { day: 1, title: 'SQL Prep', start: 9, end: 11, category: 'study' },
    { day: 1, title: 'Lunch Run', start: 12, end: 13, category: 'health' },
    { day: 2, title: 'Data Pipeline', start: 9, end: 12, category: 'work' },
    { day: 3, title: 'Client call', start: 14, end: 15, category: 'work' },
    { day: 4, title: 'Code review', start: 10, end: 11, category: 'work' },
    { day: 5, title: 'Hiking', start: 9, end: 13, category: 'travel' },
    { day: 6, title: 'Meal prep', start: 11, end: 12.5, category: 'personal' },
  ];
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
      <div style={{ width: 52, flexShrink: 0 }}>
        <div style={{ height: 40 }} />
        {HOURS.map(h => (
          <div key={h} style={{ height: hourHeight, display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{formatHour(h)}</span>
          </div>
        ))}
      </div>
      {days.map((d, i) => (
        <div key={d} style={{ flex: 1, borderLeft: '1px solid var(--border)', minWidth: 80, position: 'relative' }}>
          <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: i === todayIdx ? 600 : 400, color: i === todayIdx ? 'var(--accent)' : 'var(--text-muted)', background: i === todayIdx ? 'var(--accent-lighter)' : 'transparent', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
            {d}
          </div>
          <div style={{ position: 'relative', height: HOURS.length * hourHeight }}>
            {HOURS.map(h => <div key={h} style={{ position: 'absolute', top: (h - startHour) * hourHeight, left: 0, right: 0, height: hourHeight, borderTop: '1px solid var(--border)' }} />)}
            {sampleWeekBlocks.filter(b => b.day === i).map((b, bi) => (
              <div key={bi} style={{ position: 'absolute', top: (b.start - startHour) * hourHeight, left: 2, right: 2, height: Math.max((b.end - b.start) * hourHeight - 3, 18), borderRadius: 4, background: `var(--cat-${b.category}-bg)`, color: `var(--cat-${b.category}-text)`, padding: '2px 5px', fontSize: 11, fontWeight: 500, overflow: 'hidden' }}>
                {b.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyView() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const eventsByDay: Record<number, { title: string; category: string }[]> = {
    3: [{ title: 'Sprint Start', category: 'work' }], 7: [{ title: 'SQL Prep', category: 'study' }],
    10: [{ title: 'Hiking trip', category: 'travel' }], 14: [{ title: 'Client call', category: 'work' }, { title: 'Gym', category: 'health' }],
    17: [{ title: 'Reading day', category: 'free' }], 21: [{ title: 'Meal prep', category: 'personal' }], 24: [{ title: 'Data pipeline', category: 'work' }],
  };
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
        {dayHeaders.map(d => <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '100px' }}>
        {cells.map((d, i) => {
          const isToday = d === today.getDate();
          const events = d ? (eventsByDay[d] || []) : [];
          return (
            <div key={i} style={{ border: '1px solid var(--border)', padding: 6, background: d ? 'var(--bg-alt)' : 'var(--bg)' }}>
              {d && <>
                <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: isToday ? 600 : 400, background: isToday ? 'var(--accent)' : 'transparent', color: isToday ? 'white' : 'var(--text-primary)', marginBottom: 4 }}>{d}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {events.slice(0, 2).map((e, ei) => <div key={ei} style={{ borderRadius: 3, padding: '1px 5px', fontSize: '0.65rem', fontWeight: 500, background: `var(--cat-${e.category}-bg)`, color: `var(--cat-${e.category}-text)`, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{e.title}</div>)}
                  {events.length > 2 && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{events.length - 2} more</div>}
                </div>
              </>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const [view, setView] = useState('daily');
  const [date, setDate] = useState(new Date());
  const [blocks, setBlocks] = useState<Block[]>(SAMPLE_BLOCKS);
  const [hourHeight, setHourHeight] = useState(64);

  function onPrev() { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); }
  function onNext() { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); }

  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.1 }}>{dateStr}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{dayName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {['Daily', 'Weekly', 'Monthly'].map(v => (
              <button key={v} onClick={() => setView(v.toLowerCase())} style={{ padding: '5px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 500, background: view === v.toLowerCase() ? 'var(--accent-light)' : 'transparent', color: view === v.toLowerCase() ? 'var(--accent)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all var(--trans-fast)' }}>{v}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6 }}><Icon name="chevronLeft" size={16} /></button>
            <button onClick={() => setDate(new Date())} style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>Today</button>
            <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6 }}><Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
      </div>

      {view === 'daily' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px 0', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: 4 }}>Zoom</span>
          <button onClick={() => setHourHeight(h => Math.max(40, h - 10))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 8px', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>−</button>
          <button onClick={() => setHourHeight(h => Math.min(120, h + 10))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 8px', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>+</button>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: view === 'monthly' ? 0 : '12px 0 12px 12px', display: 'flex', flexDirection: 'column' }}>
        {view === 'daily'   && <DailyView blocks={blocks} setBlocks={setBlocks} hourHeight={hourHeight} />}
        {view === 'weekly'  && <WeeklyView hourHeight={Math.min(hourHeight, 56)} />}
        {view === 'monthly' && <MonthlyView />}
      </div>
    </div>
  );
}
