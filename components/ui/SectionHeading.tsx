export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 'var(--text-h3)', fontWeight: 600,
      color: 'var(--text-secondary)', marginBottom: 16,
      paddingBottom: 10, borderBottom: '1px solid var(--border)',
    }}>
      {children}
    </h2>
  );
}
