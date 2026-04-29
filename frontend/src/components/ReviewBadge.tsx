export default function ReviewBadge({ score, feedback }: { score: number; feedback: string }) {
  const color = score >= 8 ? 'var(--green)' : score >= 5 ? 'var(--gold)' : 'var(--red)';
  const bgColor = score >= 8 ? 'var(--green-dim)' : score >= 5 ? 'var(--gold-dim)' : 'rgba(248,81,73,0.1)';
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '24px 32px',
      display: 'flex', alignItems: 'center', gap: '20px',
      animation: 'fadeUp 0.5s ease 0.2s forwards', opacity: 0, boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
        background: bgColor, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', fontWeight: 700, color, fontFamily: 'Playfair Display, serif',
      }}>
        {score}
      </div>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
          Quality Review
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{feedback}</p>
      </div>
    </div>
  );
}