# Citation Deep Link Backend Context

Goal: when the model answers in chat and includes citations, the user should be able to click a citation and open the original source document, ideally at the exact cited page or location.

Current frontend behavior:

- `POST /chat` returns citations.
- `ChatScreen` currently renders citation pills under assistant answers.
- When a citation pill is pressed, the frontend opens `CitationModal`.
- Current `CitationModal` only receives a citation string and does not know the full citation object.
- Current frontend discards these backend citation fields when converting the response:
  - `id`
  - `documentId`
  - `categoryId`
  - `page`
  - `excerpt`
  - `score`
- Law document viewer can now show a PDF inline on Expo web.
- Law document viewer can infer PDF URL from:

```txt
GET /law/documents/{documentId}/download
```

What we want:

```txt
Chat answer citation pill
  -> click source
  -> open citation detail / document viewer
  -> show original source PDF
  -> jump to cited page when possible
  -> show excerpt/metadata so user knows why it was cited
```

## Backend Requirements

### 1. Keep Citation Metadata Rich In `/chat`

Every citation returned by `POST /chat` should include enough information for frontend navigation.

Required citation fields:

```ts
interface RagCitation {
  id: string;
  title: string;
  fullCitation: string;
  documentId: string;
  categoryId: string;
  page?: number;
  excerpt?: string;
  score?: number;
}
```

Recommended additional fields:

```ts
interface RagCitation {
  fileName?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  downloadUrl?: string;
  pageStart?: number;
  pageEnd?: number;
  chunkId?: string;
  sectionTitle?: string;
  locationLabel?: string;
}
```

### 2. `documentId` Must Match Law Library Document IDs

The `documentId` in each citation must be the same id accepted by:

```txt
GET /law/documents/{documentId}
GET /law/documents/{documentId}/download
```

Important: current backend document ids can contain slashes, for example:

```txt
tax/05242819-1833-4f0c-aadb-bc79f53618df-2ddc0ccedb-pdf
```

The frontend URL-encodes document ids before calling document endpoints.

Backend must support encoded ids like:

```txt
tax%2F05242819-1833-4f0c-aadb-bc79f53618df-2ddc0ccedb-pdf
```

### 3. Page Numbers Should Be Actual PDF Pages

If backend returns:

```json
{
  "page": 4
}
```

frontend will interpret that as PDF page 4.

Backend should avoid returning arbitrary chunk numbers in `page`. If the source location is not a real PDF page, use another field:

```json
{
  "chunkId": "chunk_123",
  "locationLabel": "OCR chunk 12",
  "page": null
}
```

Recommended page rules:

- `page` should be 1-based.
- `pageStart` and `pageEnd` can be used for multi-page citations.
- If OCR extraction cannot determine the page, return `page: null` or omit `page`.
- If a page is approximate, include `locationLabel`, for example `Approx. OCR page 4`.

### 4. PDF Download/View Endpoint

Backend should expose original PDFs through:

```txt
GET /law/documents/{documentId}/download
```

Expected behavior:

- Return `Content-Type: application/pdf`.
- Support URL-encoded document ids.
- Ideally support browser rendering inline.
- Use `Content-Disposition: inline` for in-browser viewing if possible.
- If using `Content-Disposition: attachment`, browser may force download instead of inline view.

Recommended headers:

```http
Content-Type: application/pdf
Content-Disposition: inline; filename="<safe-file-name>.pdf"
```

Optional but useful:

```http
Accept-Ranges: bytes
```

Byte range support helps browsers load large PDFs efficiently.

### 5. Document Detail Endpoint Should Include File URL

Current frontend can infer download URL, but it is cleaner if backend returns it directly.

Recommended `GET /law/documents/{documentId}` response:

```json
{
  "id": "tax/l2018-20171209-e3d8620e22-pdf",
  "categoryId": "tax",
  "title": "Law on Financial Management 2018",
  "subtitle": "Taxation statutes and guidance",
  "year": "2018",
  "pages": 27,
  "size": "17.0 MB",
  "content": "OCR text or plain text preview...",
  "pdfUrl": "http://localhost:8000/law/documents/tax%2Fl2018-20171209-e3d8620e22-pdf/download"
}
```

Supported frontend URL fields:

```txt
pdfUrl
fileUrl
downloadUrl
```

Frontend checks them in this order:

```txt
pdfUrl -> fileUrl -> downloadUrl -> inferred /download endpoint
```

### 6. Optional Citation Detail Endpoint

The frontend has a scaffolded client for:

```txt
GET /citations/{citationId}
```

Backend can use this if `/chat` should keep citation payloads small.

Suggested response:

```json
{
  "id": "cite_001",
  "title": "Law on Taxation",
  "fullCitation": "Law on Taxation, Article 109",
  "documentId": "tax/law-on-taxation-2023-pdf",
  "categoryId": "tax",
  "page": 4,
  "pageStart": 4,
  "pageEnd": 5,
  "excerpt": "Patent tax applies to taxpayers carrying out business in the Kingdom of Cambodia.",
  "score": 0.8463,
  "pdfUrl": "http://localhost:8000/law/documents/tax%2Flaw-on-taxation-2023-pdf/download"
}
```

### 7. RAG Chunk Metadata Needed For Exact Source Links

To support exact citation navigation, every indexed RAG chunk should keep source metadata.

Recommended chunk metadata:

```ts
interface IndexedChunkMetadata {
  chunkId: string;
  documentId: string;
  categoryId: string;
  title: string;
  originalFileName: string;
  pdfPath?: string;
  pageStart?: number;
  pageEnd?: number;
  sectionTitle?: string;
  locationLabel?: string;
}
```

When retrieval returns chunks, the answer citation builder should convert chunk metadata into `RagCitation`.

Critical point:

- Do not let the LLM invent citation page numbers.
- Page/document metadata should come from retrieval/index metadata, not generated text.

## Frontend Work After Backend Supports This

Frontend should then:

1. Keep full citation objects in `ChatScreen` instead of reducing them to `{ title, fullCitation }`.
2. Update `CitationModal` to receive `RagCitation`.
3. Show:
   - title
   - fullCitation
   - page/location
   - excerpt
   - score if useful for debugging
4. Add action: `Open Source`.
5. Navigate to `LawDocumentViewer` with:

```ts
{
  categoryId: citation.categoryId,
  documentId: citation.documentId,
  page: citation.page
}
```

6. `LawDocumentViewer` should open the PDF inline and include page fragment on web when possible:

```txt
<pdfUrl>#page=<page>
```

Example:

```txt
http://localhost:8000/law/documents/tax%2Flaw-on-taxation-2023-pdf/download#page=4
```

Browser support for `#page=` depends on the browser/PDF viewer, but it is the standard lightweight web approach.

## Desired User Experience

User asks:

```txt
Law regarding tax rate for a shop business
```

Assistant answers with citations:

```txt
[1] Law on Taxation
[2] Sub Decree Patent
```

User clicks `[2] Sub Decree Patent`.

Frontend shows:

- citation detail
- cited excerpt
- source metadata
- button to open full source

User clicks open source.

Frontend opens the full PDF in the document viewer at the cited page:

```txt
Sub Decree Patent PDF, page 4
```

If exact page is unknown, frontend still opens the source document and shows the excerpt/location label.

