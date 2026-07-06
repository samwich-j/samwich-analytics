'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';

const HEADER = {
  name: 'Sam Johnston',
  title: 'Data Analyst',
  email: 'sam.redd.johnston2@gmail.com',
  phone: '385-497-4333',
  location: 'Mapleton, Utah',
  linkedin: 'linkedin.com/in/samuel-redd-johnston',
  website: 'samwich-analytics.com',
};

const SKILLS = [
  {
    label: 'Research & Evaluation',
    cat: 'accent',
    skills: ['Research Design', 'Program Evaluation', 'Needs Assessment', 'Gap Analysis', 'Learning Outcomes Assessment', 'Mixed-Methods Research', 'Survey/Experiment Design', 'Benchmarking', 'Continuous Improvement'],
  },
  {
    label: 'Analysis & Tools',
    cat: 'gold',
    skills: ['R', 'Python', 'SQL', 'SPSS', 'Excel', 'PowerBI', 'Tableau', 'Qualtrics', 'Sawtooth Software', 'Jamovi'],
  },
  {
    label: 'Methods',
    cat: 'work',
    skills: ['Regression (Logistic, Elastic Net)', 'Forecasting (ARIMA, Prophet)', 'NLP', 'Conjoint Analysis', 'ETL Pipelines', 'Data Cleaning & Management', 'Data Visualization & Reporting'],
  },
  {
    label: 'Other',
    cat: 'travel',
    skills: ['Cross-Functional Collaboration', 'Team Leadership', 'Executive Presentations', 'Spanish (fluent)'],
  },
];

const EXPERIENCE = [
  {
    title: 'Data Analyst',
    company: 'UVU Dept. of Academic Analytics & Assessment',
    location: 'Orem, UT',
    date: 'January 2025 – Present',
    bullets: [
      'Conducted program evaluation of institutional learning outcomes using NLP techniques to audit curriculum alignment, performing gap analyses to identify discrepancies between desired and actual program effectiveness.',
      'Designed and executed Python/R ETL workflows to ingest and clean 1M+ student records, enabling evidence-based reporting through PowerBI dashboards for academic leadership.',
      'Created data dictionaries in collaboration with cross-functional teams of 100+ faculty to support data understanding, consistency, and continuous improvement in assessment practices.',
      'Analyzed complex datasets using quantitative methods (Logistic Regression, Correlation) to identify key drivers of student retention, engagement, and enrollment trends.',
    ],
  },
  {
    title: 'Statistics Research Lab Leader/Analyst',
    company: 'UVU Woodbury Center for Analytical Insight',
    location: 'Orem, UT',
    date: 'May 2024 – May 2026',
    bullets: [
      'Designed and implemented research studies using both qualitative and quantitative methodologies, including Discrete Choice Experiments (Conjoint Analysis) in Sawtooth Software.',
      'Applied statistical models (Elastic Net Regression, ARIMA, Prophet) to forecast outcomes and benchmark performance in healthcare and financial research projects.',
      'Led and mentored 20+ researchers through end-to-end project delivery—from research design and data collection (Qualtrics) to final reports and presentations for diverse stakeholders.',
      'Consulted for regional stakeholders (Utah Valley Chamber of Commerce, City of Midway), translating research findings into actionable, evidence-based policy recommendations.',
    ],
  },
  {
    title: 'Business Statistics/R/Excel Tutor',
    company: 'UVU Academic Tutoring Dept.',
    location: 'Orem, UT',
    date: 'August 2024 – January 2025',
    bullets: [
      'Taught statistical concepts, research methods, and R programming to 100+ students; provided guidance on quantitative analysis techniques.',
      'Trusted to substitute for a professor\'s Business Statistics class, delivering instruction on research methodology and data analysis in R.',
    ],
  },
  {
    title: 'Laborer',
    company: 'Johnston & Phillips Construction',
    location: 'Springville, UT',
    date: 'August 2022 – January 2025',
    bullets: [
      'Managed tasks and deadlines across up to 5 concurrent construction projects with million-dollar budgets.',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'M.S. Analytics (Data Science, Online)',
    school: 'Georgia Institute of Technology',
    date: 'Starting Fall 2026',
    details: [],
  },
  {
    degree: 'B.S. Business & Analysis (GPA 3.97)',
    school: 'Utah Valley University',
    date: '2022 – 2026',
    details: ['Minor: Applied Data Analytics', 'Certificate: Data Analytics & Decision Making'],
  },
  {
    degree: 'A.S. Business Management',
    school: 'Utah Valley University',
    date: '2022 – 2024',
    details: [],
  },
];

const AWARDS = [
  'Presidential Scholarship (Full-ride, academic)',
  'Wasatch Cup Healthcare Case Competition Winner, 2025',
  'Student Achievement Award in Business & Analysis',
];

const fileId = '11oiuQnPS56hgrd5h3eO1leGf1D-GS8YB';
const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

export default function ResumePage() {
  return (
    <div className="content-inner" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <section style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {HEADER.name}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
            {HEADER.title}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.8 }}>
            <a href={`mailto:${HEADER.email}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {HEADER.email}
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {HEADER.phone}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {HEADER.location}
            </span>
            <a href={`https://${HEADER.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a href={`https://${HEADER.website}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {HEADER.website}
            </a>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href={viewUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 'var(--text-sm)', textDecoration: 'none', transition: 'opacity var(--trans-fast)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open in Google Drive
            </a>
            <a href={downloadUrl}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 500, fontSize: 'var(--text-sm)', textDecoration: 'none', background: 'var(--bg)', transition: 'background var(--trans-fast)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </a>
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeading>Skills</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SKILLS.map(g => (
              <div key={g.label}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  {g.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {g.skills.map(s => <Tag key={s} label={s} category={g.cat} />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeading>Work Experience</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {EXPERIENCE.map(job => (
              <div key={job.title + job.company} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '2px 12px', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>{job.title}</h3>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{job.date}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 500, margin: '0 0 10px' }}>
                  {job.company} &nbsp;·&nbsp; {job.location}
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {job.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeading>Education</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {EDUCATION.map(edu => (
              <div key={edu.degree} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '2px 12px', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>{edu.degree}</h3>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{edu.date}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 500, margin: 0 }}>{edu.school}</p>
                {edu.details.length > 0 && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6, marginBottom: 0 }}>
                    {edu.details.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeading>Awards &amp; Honors</SectionHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AWARDS.map(a => (
              <div key={a} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 14px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {a}
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer */}
        <section style={{ marginBottom: 0 }}>
          <SectionHeading>Volunteer Experience</SectionHeading>
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '2px 12px', marginBottom: 2 }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Volunteer Missionary</h3>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Aug 2020 – Aug 2022</span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 500, margin: '0 0 10px' }}>
              Church of Jesus Christ of Latter-Day Saints &nbsp;·&nbsp; Quito, Ecuador
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                Communicated with 1,000+ people, supervised 20+ volunteers, and developed fluency in Spanish.
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
