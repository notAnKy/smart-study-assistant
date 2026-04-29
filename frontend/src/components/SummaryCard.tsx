export default function SummaryCard({ summary, keyPoints }: { summary: string; keyPoints: string[] }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '28px 32px',
      animation: 'fadeUp 0.5s ease forwards', boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '22px' }}>📄</span>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Summary</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>{summary}</p>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Key Points
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {keyPoints.map((point, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '14px', marginTop: '2px', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}