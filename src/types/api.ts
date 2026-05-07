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
  pageStart?: number;
  pageEnd?: number;
  excerpt?: string;
  score?: number;
  fileName?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  fileUrl?: string;
  downloadUrl?: string;
  chunkId?: string;
  sectionTitle?: string;
  locationLabel?: string;
}

export interface RagChatResponse {
  chatId: string;
  answer: string;
  citations: RagCitation[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  preferences?: {
    darkMode?: boolean;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token?: string;
  password: string;
}

export interface ChatSummaryResponse {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

export interface ChatMessageResponse {
  id: string;
  role: RagRole;
  content: string;
  citations?: RagCitation[];
  createdAt?: string;
}

export interface ChatDetailResponse {
  id: string;
  title: string;
  updatedAt?: string;
  messages: ChatMessageResponse[];
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
  pdfUrl?: string;
  fileUrl?: string;
  downloadUrl?: string;
}
