import axios from 'axios';
import type { StudyResult, SessionSummary } from '../types';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

export const runStudyPipeline = async (text: string, file?: File): Promise<StudyResult> => {
  const form = new FormData();
  if (file) form.append('file', file);
  else form.append('text', text);
  const res = await api.post('/study', form);
  return res.data;
};

export const sendChatMessage = async (
  sessionId: number,
  context: string,
  question: string
): Promise<string> => {
  const res = await api.post('/chat', { session_id: sessionId, context, question });
  return res.data.answer;
};

export const fetchSessions = async (): Promise<SessionSummary[]> => {
  const res = await api.get('/sessions');
  return res.data;
};

export const fetchSessionById = async (id: number): Promise<StudyResult> => {
  const res = await api.get(`/sessions/${id}`);
  return res.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await api.delete(`/sessions/${id}`);
};