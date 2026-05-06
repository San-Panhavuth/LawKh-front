import { buildApiUrl } from '../config/api';
import {
  ChatSummaryResponse,
  LawCategoryResponse,
  LawDocumentResponse,
  LawDocumentSummaryResponse,
  RagChatRequest,
  RagChatResponse,
  RagCitation,
} from '../types/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(body || `Request failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

export function askRagQuestion(request: RagChatRequest, signal?: AbortSignal) {
  return requestJson<RagChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify(request),
    signal,
  });
}

export function getChatHistory(signal?: AbortSignal) {
  return requestJson<ChatSummaryResponse[]>('/chats', { signal });
}

export function getLawCategories(signal?: AbortSignal) {
  return requestJson<LawCategoryResponse[]>('/law/categories', { signal });
}

export function getLawDocuments(categoryId: string, signal?: AbortSignal) {
  return requestJson<LawDocumentSummaryResponse[]>(`/law/categories/${encodeURIComponent(categoryId)}/documents`, {
    signal,
  });
}

export function getLawDocument(documentId: string, signal?: AbortSignal) {
  return requestJson<LawDocumentResponse>(`/law/documents/${encodeURIComponent(documentId)}`, { signal });
}

export function getCitation(citationId: string, signal?: AbortSignal) {
  return requestJson<RagCitation>(`/citations/${encodeURIComponent(citationId)}`, { signal });
}
