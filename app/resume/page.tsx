export default function ResumePage() {
  return (
    <div className="reading-inner" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Sam Johnston
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 2 }}>
          Data Analyst & Statistical Consultant
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          sam.redd.johnston2@gmail.com · Utah Valley University
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 32 }} />

      {/* Education */}
      <ResumeSection title="Education">
        <ResumeEntry
          title="B.S. Statistics"
          subtitle="Utah Valley University · Expected May 2026"
          details={['Concentration: Data Science', 'Relevant coursework: Survey Methodology, Experimental Design, Regression Analysis, Data Visualization']}
        />
      </ResumeSection>

      {/* Experience */}
      <ResumeSection title="Experience">
        <ResumeEntry
          title="Statistical Consultant"
          subtitle="Independent · 2024–Present"
          details={[
            'Designed and analyzed surveys for municipal and private clients',
            'Produced professional reports and presentations for non-technical stakeholders',
            'Delivered data for Midway City open space bond initiative',
          ]}
        />
        <ResumeEntry
          title="Data Analyst — Utah Valley Growth & Prosperity Summit"
          subtitle="Utah Valley Chamber of Commerce · 2024"
          details={[
            'Cleaned and processed survey responses from regional business leaders',
            'Built summary visualizations and analytics for summit presentations',
          ]}
        />
      </ResumeSection>

      {/* Projects */}
      <ResumeSection title="Projects">
        <ResumeEntry
          title="Midway Open Space Bond Report"
          subtitle="Survey Design · R · Statistical Analysis"
          details={['Community survey to evaluate resident support for a bond initiative; results delivered to city planners']}
        />
        <ResumeEntry
          title="Call of Duty: Warzone Geospatial Analysis"
          subtitle="Python · Data Engineering · Geospatial Analysis"
          details={['Pipeline to scrape and spatially analyze thousands of in-game kill events; identified strategic hotspots across the Caldera map']}
        />
      </ResumeSection>

      {/* Skills */}
      <ResumeSection title="Skills">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px 24px' }}>
          {[
            ['Languages', 'R, Python'],
            ['Visualization', 'Tableau, Power BI'],
            ['Methods', 'Survey Design, Experimental Design, Statistical Analysis'],
            ['Tools', 'Jamovi, Excel, Data Cleaning'],
          ].map(([cat, val]) => (
            <div key={cat}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat}</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{val}</span>
            </div>
          ))}
        </div>
      </ResumeSection>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{
        fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 16, paddingBottom: 6,
        borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </section>
  );
}

function ResumeEntry({ title, subtitle, details }: { title: string; subtitle: string; details: string[] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{subtitle}</span>
      </div>
      <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
        {details.map(d => (
          <li key={d} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{d}</li>
        ))}
      </ul>
    </div>
  );
}
