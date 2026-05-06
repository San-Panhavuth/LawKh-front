export type RagRole = 'user' | 'assistant';

export interface RagHistoryMessage {
  role: RagRole;
  content: string;
}

export interface RagChatFilters {
  categoryIds?: string[];
  documentIds?: string[];
}

export interface RagChatRequest {
  question: string;
  chatId?: string;
  history: RagHistoryMessage[];
  filters?: RagChatFilters;
}

export interface RagCitation {
  id: string;
  title: string;
  fullCitation: string;
  documentId?: string;
  categoryId?: string;
  page?: number;
  excerpt?: string;
  score?: number;
}

export interface RagChatResponse {
  chatId: string;
  answer: string;
  citations: RagCitation[];
}

export interface ChatSummaryResponse {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

export interface LawCategoryResponse {
  id: string;
  icon?: string;
  name: string;
  description: string;
  documentCount: number;
}

export interface LawDocumentSummaryResponse {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  year: string;
  pages?: number;
  size?: string;
}

export interface LawDocumentResponse extends LawDocumentSummaryResponse {
  content: string;
}
