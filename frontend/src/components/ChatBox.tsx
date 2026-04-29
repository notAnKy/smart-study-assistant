import { useState } from 'react';
import { sendChatMessage } from '../services/api';
import type { ChatMessage } from '../types';

export default function ChatBox({ sessionId, context }: { sessionId: number; context: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const answer = await sendChatMessage(sessionId, context, question);
      setMessages(m => [...m, { role: 'assistant', content: answer }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px)',
      animation: 'fadeUp 0.5s ease 0.3s forwards', opacity: 0, boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '22px' }}>💬</span>
        <h2 style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 600 }}>Ask the Explainer</h2>
      </div>

      {messages.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
          Ask anything about the material you just studied...
        </p>
      )}

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        marginBottom: '16px', maxHeight: '300px', overflowY: 'auto',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            fontSize: '14px', lineHeight: 1.7,
            background: msg.role === 'user' ? 'var(--gold-dim)' : 'var(--bg-hover)',
            border: `1px solid ${msg.role === 'user' ? 'var(--gold)' : 'var(--border)'}`,
            color: msg.role === 'user' ? 'var(--gold-light)' : 'var(--text-secondary)',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            wordBreak: 'break-word',
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
            Explainer is thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask a question about the material..."
          style={{
            flex: 1, minWidth: 0,
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '12px 14px',
            color: 'var(--text-primary)', fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif', outline: 'none',
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: 'var(--gold)', color: '#0d1117', border: 'none',
          borderRadius: 'var(--radius-sm)', padding: '12px 16px',
          fontWeight: 700, fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
          flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          Send
        </button>
      </div>
    </div>
  );
}