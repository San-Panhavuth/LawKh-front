export type MessageType = 'user' | 'ai';

export interface Citation {
  title: string;
  fullCitation: string;
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  citations?: Citation[];
}

export interface Chat {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  group: 'This Week' | 'This Month' | 'Earlier';
}

export interface LawCategory {
  id: string;
  icon: string;
  name: string;
  description: string;
  documentCount: number;
}

export interface LawDocument {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  pages: number;
  size: string;
  content: string;
}
