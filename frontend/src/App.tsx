import { useState, useRef } from 'react';
import { runStudyPipeline, fetchSessionById } from './services/api';
import type { StudyResult } from './types';
import AgentProgress from './components/AgentProgress';
import SummaryCard from './components/SummaryCard';
import QuizCard from './components/QuizCard';
import ReviewBadge from './components/ReviewBadge';
import ChatBox from './components/ChatBox';
import HistoryPanel from './components/HistoryPanel';
import { useWindowWidth } from './hooks/useWindowWidth';
import './index.css';

export default function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyResult | null>(null);
  const [error, setError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const width = useWindowWidth();
  const isMobile = width < 768;

  const run = async () => {
    if (!text.trim() && !file) { setError('Please enter text or upload a file.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const data = await runStudyPipeline(text, file || undefined);
      if ((data as any).error) { setError((data as any).error); return; }
      setResult(data);
    } catch {
      setError('Something went wrong. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (id: number) => {
    setError(''); setLoading(true); setResult(null);
    try {
      const data = await fetchSessionById(id);
      setResult(data);
    } catch {
      setError('Failed to load session.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setText(''); setFile(null); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: isMobile ? '14px 16px' : '18px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', background: 'var(--gold)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '15px', flexShrink: 0,
          }}>🎓</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '17px' : '20px', fontWeight: 700 }}>
            Study<span style={{ color: 'var(--gold)' }}>Mind</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {!isMobile && (
            <span style={{
              background: 'var(--green-dim)', border: '1px solid var(--green)',
              borderRadius: '20px', padding: '3px 12px', fontSize: '12px',
              color: 'var(--green)', fontWeight: 500,
            }}>● 4 Agents Active</span>
          )}
          <button onClick={() => setHistoryOpen(true)} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: isMobile ? '6px 10px' : '6px 16px',
            color: 'var(--text-secondary)', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            🕐 {!isMobile && 'History'}
          </button>
          {result && (
            <button onClick={reset} style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: isMobile ? '6px 10px' : '6px 16px',
              color: 'var(--text-secondary)', fontSize: '13px',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
              {isMobile ? '✕' : 'New Session'}
            </button>
          )}
        </div>
      </header>

      {/* History Panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={loadSession}
        currentId={result?.session_id}
        isMobile={isMobile}
      />

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '32px 16px' : '60px 24px' }}>
        {!result && !loading ? (
          <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <h1 style={{
                fontSize: isMobile ? '36px' : '48px',
                fontWeight: 700, lineHeight: 1.2, marginBottom: '16px'
              }}>
                Study smarter,<br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>not harder.</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '15px' : '17px', maxWidth: '480px', margin: '0 auto' }}>
                Paste your study material or upload a PDF, DOCX, or TXT file. Four AI agents will summarize it, quiz you, and answer your questions.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: isMobile ? '20px 16px' : '32px',
              boxShadow: 'var(--shadow)',
            }}>
              <div onClick={() => fileRef.current?.click()} style={{
                border: `2px dashed ${file ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', padding: '20px',
                textAlign: 'center', cursor: 'pointer', marginBottom: '20px',
                background: file ? 'var(--gold-dim)' : 'transparent',
                transition: 'all 0.2s ease',
              }}>
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={e => { setFile(e.target.files?.[0] || null); setText(''); }} />
                <p style={{ color: file ? 'var(--gold-light)' : 'var(--text-muted)', fontSize: '14px' }}>
                  {file ? `📎 ${file.name}` : '📁 Click to upload a PDF, DOCX, or TXT file'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or paste text</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <textarea value={text} onChange={e => { setText(e.target.value); setFile(null); }}
                placeholder="Paste your study material here..." rows={isMobile ? 6 : 8}
                style={{
                  width: '100%', background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '16px', color: 'var(--text-primary)',
                  fontSize: '14px', fontFamily: 'DM Sans, sans-serif', resize: 'vertical',
                  outline: 'none', lineHeight: 1.7, transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />

              {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

              <button onClick={run} disabled={loading} style={{
                width: '100%', marginTop: '16px',
                background: 'var(--gold)', color: '#0d1117',
                border: 'none', borderRadius: 'var(--radius-md)',
                padding: '16px', fontSize: '16px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s ease',
              }}>
                ⚡ Run Study Pipeline
              </button>
            </div>
          </div>
        ) : loading ? (
          <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
            <AgentProgress active={loading} />
          </div>
        ) : result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h2 style={{ fontSize: isMobile ? '22px' : '28px' }}>Your Study Session</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Session #{result.session_id}</span>
            </div>
            <ReviewBadge score={result.review.score} feedback={result.review.feedback} />
            <SummaryCard summary={result.summary} keyPoints={result.key_points} />
            <QuizCard quiz={result.quiz} />
            <ChatBox sessionId={result.session_id} context={result.summary} />
          </div>
        ) : null}
      </main>
    </div>
  );
}