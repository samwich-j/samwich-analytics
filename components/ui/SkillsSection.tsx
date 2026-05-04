import { Tag } from './Tag';

const SKILL_GROUPS = [
  { label: 'Languages',    skills: ['R', 'Python'],                                           cat: 'accent'  },
  { label: 'Visualization', skills: ['Tableau', 'Power BI'],                                  cat: 'gold'    },
  { label: 'Methods',      skills: ['Statistical Analyses', 'Survey Design', 'Experiment Design'], cat: 'work' },
  { label: 'Tools',        skills: ['Jamovi', 'Excel', 'Data Cleaning & Management'],          cat: 'travel'  },
];

export function SkillsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SKILL_GROUPS.map(g => (
        <div key={g.label}>
          <div style={{
            fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8,
          }}>
            {g.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.skills.map(s => <Tag key={s} label={s} category={g.cat} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
