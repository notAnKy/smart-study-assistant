import { useEffect, useState } from 'react';

const agents = [
  { id: 'summarizer', label: 'Summarizer', icon: '📄', desc: 'Extracting key concepts' },
  { id: 'quiz_maker', label: 'Quiz Maker', icon: '❓', desc: 'Generating questions' },
  { id: 'reviewer',   label: 'Reviewer',   icon: '✅', desc: 'Evaluating quality' },
];

export default function AgentProgress({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) { setStep(0); return; }
    const interval = setInterval(() => setStep(s => Math.min(s + 1, agents.length)), 2200);
    return () => clearInterval(interval);
  }, [active]);

  if (!active && step === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '32px 0' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
        Agent Pipeline Running
      </p>
      {agents.map((agent, i) => {
        const done = step > i + 1;
        const running = step === i + 1;
        return (
          <div key={agent.id} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 18px', borderRadius: 'var(--radius-md)',
            border: `1px solid ${running ? 'var(--gold)' : done ? 'var(--border)' : 'var(--border-light)'}`,
            background: running ? 'var(--gold-dim)' : done ? 'var(--green-dim)' : 'var(--bg-card)',
            transition: 'all 0.4s ease',
            animation: running ? 'pulse-gold 1.5s infinite' : 'none',
            opacity: i >= step && !running ? 0.4 : 1,
          }}>
            <span style={{ fontSize: '20px' }}>{agent.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: running ? 'var(--gold-light)' : done ? 'var(--green)' : 'var(--text-secondary)' }}>
                {agent.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{agent.desc}</div>
            </div>
            <div style={{ fontSize: '13px', color: done ? 'var(--green)' : running ? 'var(--gold)' : 'var(--text-muted)' }}>
              {done ? '✓ Done' : running ? 'Running...' : 'Waiting'}
            </div>
          </div>
        );
      })}
    </div>
  );
}