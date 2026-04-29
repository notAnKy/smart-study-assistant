import { useEffect, useState } from 'react';
import type { SessionSummary } from '../types';
import { fetchSessions, deleteSession } from '../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
  currentId?: number;
  isMobile?: boolean; 
}

export default function HistoryPanel({ open, onClose, onSelect, currentId, isMobile }: Props) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchSessions().then(setSessions).finally(() => setLoading(false));
  }, [open]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // prevent triggering onSelect
    setDeleting(id);
    try {
      await deleteSession(id);
      setSessions(s => s.filter(session => session.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 200, backdropFilter: 'blur(4px)',
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: isMobile ? '100vw' : '380px',  // full screen on mobile
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.25s ease forwards',
        }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '2px' }}>Session History</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{sessions.length} sessions saved</p>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: '8px', width: '32px', height: '32px',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Sessions list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
              Loading sessions...
            </p>
          )}
          {!loading && sessions.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
              No sessions yet. Run your first study pipeline!
            </p>
          )}
          {sessions.map(session => (
            <div key={session.id}
              onClick={() => { onSelect(session.id); onClose(); }}
              style={{
                padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '10px',
                border: `1px solid ${currentId === session.id ? 'var(--gold)' : 'var(--border)'}`,
                background: currentId === session.id ? 'var(--gold-dim)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = currentId === session.id ? 'var(--gold)' : 'var(--border)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  background: 'var(--gold-dim)', border: '1px solid var(--gold)',
                  borderRadius: '20px', padding: '2px 10px',
                  fontSize: '11px', color: 'var(--gold)', fontWeight: 600,
                }}>
                  Session #{session.id}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {timeAgo(session.created_at)}
                  </span>
                  {/* Delete button */}
                  <button
                    onClick={e => handleDelete(e, session.id)}
                    disabled={deleting === session.id}
                    style={{
                      background: 'rgba(248,81,73,0.1)',
                      border: '1px solid rgba(248,81,73,0.3)',
                      borderRadius: '6px', width: '26px', height: '26px',
                      color: 'var(--red)', cursor: 'pointer', fontSize: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease', opacity: deleting === session.id ? 0.5 : 1,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(248,81,73,0.25)';
                      e.currentTarget.style.borderColor = 'var(--red)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(248,81,73,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(248,81,73,0.3)';
                    }}
                  >
                    {deleting === session.id ? '...' : '🗑'}
                  </button>
                </div>
              </div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '13px',
                lineHeight: 1.5, display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {session.preview}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}