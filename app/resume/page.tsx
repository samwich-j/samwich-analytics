export default function ResumePage() {
  const fileId = '11oiuQnPS56hgrd5h3eO1leGf1D-GS8YB';
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <div className="content-inner" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Sam Johnston
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
          Data Analyst &amp; Statistical Consultant
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 'var(--radius-md)',
              background: 'var(--accent)', color: '#fff',
              fontWeight: 600, fontSize: 'var(--text-sm)',
              textDecoration: 'none', transition: 'opacity var(--trans-fast)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open in Google Drive
          </a>
          <a
            href={downloadUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', color: 'var(--text-primary)',
              fontWeight: 500, fontSize: 'var(--text-sm)',
              textDecoration: 'none', background: 'var(--bg)',
              transition: 'background var(--trans-fast)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </a>
        </div>
      </div>

      <iframe
        src={embedUrl}
        title="Sam Johnston Resume"
        style={{
          width: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: 500,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}
        allow="autoplay"
      />
    </div>
  );
}
