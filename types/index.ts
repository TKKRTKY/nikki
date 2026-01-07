// Type definitions for nikki application

export interface LLMSettings {
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface DiaryEntry {
  date: string; // YYYY-MM-DD format
  body: string;
  updatedAt: Date;
}

export interface ConversationLog {
  id: string;
  date: string; // YYYY-MM-DD format
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
