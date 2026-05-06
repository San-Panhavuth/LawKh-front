# LawKH RAG Integration Notes

## Current frontend shape

- Expo React Native app with React Navigation stack + bottom tabs.
- Chat, history, law library, document list, document viewer, citations, and auth screens are currently fully local.
- Mock data lives in `src/data/mockData.ts`.
- Shared app models live in `src/types/models.ts`.
- There is no API client, persistent auth/session state, streaming transport, or backend configuration yet.

## Primary integration points

### Chat

`src/screens/ChatScreen.tsx` is the main LLM/RAG surface.

Current behavior:

- Loads existing chats from `savedChats`.
- Appends a user message locally.
- Immediately appends a canned AI message with two mock citations.

Target behavior:

- Append the user message optimistically.
- Send the question and short chat history to the RAG backend.
- Show a loading/streaming assistant message while generation is running.
- Replace the loading message with the backend answer.
- Render returned citations as the existing citation pills.
- Surface backend/network errors inside the chat rather than failing silently.

Suggested request shape:

```ts
interface ChatRequest {
  question: string;
  chatId?: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  filters?: {
    categoryIds?: string[];
    documentIds?: string[];
  };
}
```

Suggested response shape:

```ts
interface ChatResponse {
  chatId: string;
  answer: string;
  citations: Array<{
    id: string;
    title: string;
    fullCitation: string;
    documentId?: string;
    categoryId?: string;
    page?: number;
    excerpt?: string;
    score?: number;
  }>;
}
```

### Citations

`src/components/CitationModal.tsx` currently expands citation text through `citationDetails` in mock data.

Target behavior:

- Pass the full citation object into the modal, not only the citation string.
- Display source title, citation text, page/section if available, and excerpt.
- Optionally include a button to open `LawDocumentViewer` at the cited document.

### History

`src/screens/HistoryScreen.tsx` currently reads `historyItems`.

Target behavior:

- Fetch persisted chat sessions from the backend.
- Keep local search in the frontend for small lists, or delegate search to the backend once history grows.

### Law library

`src/screens/LawLibraryScreen.tsx`, `src/screens/LawDocumentListScreen.tsx`, and `src/screens/LawDocumentViewerScreen.tsx` currently read `lawCategories` and `documentsByCategory`.

Target behavior:

- Fetch categories and document metadata from the backend.
- Fetch document content or rendered document pages from the backend.
- Use stable document IDs that match citation `documentId` values.

## Local Ollama topology

Recommended architecture:

```text
Expo app -> local RAG API -> vector store + document store
                      |
                      v
                 Ollama gpt-oss:20b
```

The mobile app should generally call a local RAG API, not Ollama directly. The backend can own prompt construction, retrieval, reranking, citation mapping, model choice, context-window management, and safety/legal disclaimers.

Local URL notes:

- Web simulator: `http://localhost:<api-port>`.
- Android emulator: use the host machine alias, often `http://10.0.2.2:<api-port>` for Android Studio emulator. Some third-party emulators use a different host alias.
- Physical device with Expo Go: use the host machine LAN IP, for example `http://192.168.x.x:<api-port>`.
- Avoid hardcoding this in screens. Use an Expo public env var such as `EXPO_PUBLIC_API_BASE_URL`.

## Frontend files to add next

Suggested frontend scaffold:

- `src/config/api.ts`: resolves API base URL from `EXPO_PUBLIC_API_BASE_URL`.
- `src/services/ragClient.ts`: owns `askQuestion`, history, categories, documents, and citation-detail calls.
- `src/types/api.ts`: request/response DTOs matching the backend contract.

Once those exist, screens should import services instead of mock data directly.

## Backend contract assumptions

Minimum useful endpoints:

- `POST /chat`: non-streaming chat response.
- `POST /chat/stream`: streaming chat response using SSE or newline-delimited JSON.
- `GET /chats`: chat history list.
- `GET /chats/:chatId`: chat detail.
- `GET /law/categories`: law-library categories.
- `GET /law/categories/:categoryId/documents`: document list.
- `GET /law/documents/:documentId`: document detail.
- `GET /citations/:citationId`: citation detail, if citation payloads are too large for chat responses.

For the first integration pass, `POST /chat` is enough. Streaming can come after the basic round trip is stable.

## UX states needed before real calls

- Chat request loading state.
- Disabled send button while a request is active.
- Error message bubble for failed requests.
- Empty-state preservation.
- Optional abort/cancel generation button for long local-model responses.

## Baseline verification

`npm run typecheck` passes after installing frontend dependencies.
