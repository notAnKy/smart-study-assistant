export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ReviewResult {
  score: number;
  feedback: string;
}

export interface StudyResult {
  session_id: number;
  summary: string;
  key_points: string[];
  quiz: QuizQuestion[];
  review: ReviewResult;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SessionSummary {
  id: number;
  created_at: string;
  preview: string;
}