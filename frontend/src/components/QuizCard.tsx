import { useState } from 'react';
import type { QuizQuestion } from '../types';

export default function QuizCard({ quiz }: { quiz: QuizQuestion[] }) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const normalize = (s: string) => s.trim().toLowerCase();

  const pick = (qi: number, opt: string) => {
    if (revealed[qi]) return;
    setSelected(s => ({ ...s, [qi]: opt }));
    setRevealed(r => ({ ...r, [qi]: true }));
  };

  const score = quiz.filter((q, i) =>
    selected[i] !== undefined && normalize(selected[i]) === normalize(q.answer)
  ).length;

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '28px 32px',
      animation: 'fadeUp 0.5s ease 0.1s forwards', opacity: 0, boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>❓</span>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Quiz</h2>
        </div>
        {Object.keys(revealed).length === quiz.length && (
          <div style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: 'var(--gold-light)', fontWeight: 600 }}>
            {score}/{quiz.length} correct
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {quiz.map((q, qi) => (
          <div key={qi}>
            <p style={{ fontWeight: 500, marginBottom: '12px', fontSize: '15px' }}>
              <span style={{ color: 'var(--gold)', marginRight: '8px' }}>Q{qi + 1}.</span>{q.question}
            </p>
            <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === opt;
                const isCorrectOpt = normalize(opt) === normalize(q.answer);
                const isRevealed = revealed[qi];

                let bg = 'var(--bg-hover)';
                let border = 'var(--border)';
                let color = 'var(--text-secondary)';

                if (isRevealed && isCorrectOpt) {
                  bg = 'var(--green-dim)'; border = 'var(--green)'; color = 'var(--green)';
                } else if (isRevealed && isSelected && !isCorrectOpt) {
                  bg = 'rgba(248,81,73,0.1)'; border = 'var(--red)'; color = 'var(--red)';
                }

                return (
                  <button key={oi} onClick={() => pick(qi, opt)} style={{
                    background: bg, border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
                    color, fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                    cursor: isRevealed ? 'default' : 'pointer', textAlign: 'left',
                    transition: 'all 0.2s ease', fontWeight: isRevealed && isCorrectOpt ? 600 : 400,
                  }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed[qi] && (
              <p style={{ fontSize: '12px', marginTop: '8px', color: normalize(selected[qi]) === normalize(q.answer) ? 'var(--green)' : 'var(--red)' }}>
                {normalize(selected[qi]) === normalize(q.answer)
                  ? '✓ Correct!'
                  : `✗ Wrong — correct answer: ${q.answer}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}