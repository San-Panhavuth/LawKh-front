# LawKH Frontend Feature and Backend Contract Spec

This document describes the current Expo React Native frontend in detail so backend developers can see every feature, screen, mock dependency, expected API shape, and future backend responsibility.

Current frontend repo: `LawKh-front`

Current app type: Expo React Native app with React Navigation, also runnable on web through Expo web.

Current branch at time of writing: `frontend-rag-integration`

## Runtime Targets

The frontend can run as:

- Expo web preview, usually on `http://localhost:8082`.
- Android APK through EAS preview build.
- Expo Go or emulator during development.

The frontend reads the API base URL from:

```txt
EXPO_PUBLIC_API_BASE_URL
```

If no value is provided, it falls back to:

```txt
http://localhost:8000
```

Important target URLs:

- Web on same machine: `http://localhost:8000`
- Android emulator to host backend: `http://10.0.2.2:8000`
- Physical phone to local backend: `http://<host-lan-ip>:8000`
- Deployed backend: `https://<backend-domain>`

The API URL helper strips trailing slashes from the base URL and ensures endpoint paths start with one slash.

## App Identity and Build Metadata

Expo config in `app.json`:

- App name: `LawKH AppFront`
- Slug: `lawkh-appfront`
- Version: `1.0.0`
- Orientation: portrait
- Android package id: `com.aykayo.lawkhappfront`
- EAS project id: `ac6a5bbe-5666-4d22-828b-1befa8188160`
- Web favicon: `./assets/favicon.png`
- Android adaptive icon assets:
  - `./assets/android-icon-foreground.png`
  - `./assets/android-icon-background.png`
  - `./assets/android-icon-monochrome.png`
- Splash image: `./assets/splash-icon.png`

EAS preview APK config in `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "http://10.0.2.2:8000"
      }
    }
  }
}
```

For a production/deployed backend APK, replace the preview env URL with the deployed HTTPS backend URL and rebuild the APK.

## Navigation Map

Root stack initial route:

```txt
Login
```

Stack routes:

- `Login`
- `SignUp`
- `ForgotPassword`
- `ResetPassword`
- `MainTabs`
- `ChatDetail`
- `LawDocumentList`
- `LawDocumentViewer`
- `PrivacySecurity`
- `TermsConditions`
- `HelpSupport`

Main bottom tabs inside `MainTabs`:

- `Chat`
- `History`
- `LawLibrary`
- `Account`

Route params:

```ts
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  MainTabs: undefined;
  ChatDetail: { chatId: string };
  LawDocumentList: { categoryId: string; categoryName: string };
  LawDocumentViewer: { categoryId: string; documentId: string };
  PrivacySecurity: undefined;
  TermsConditions: undefined;
  HelpSupport: undefined;
};
```

Backend implication:

- Chat history ids must be stable because `HistoryScreen` navigates to `ChatDetail` with `chatId`.
- Law category ids and document ids must be stable because list/viewer screens navigate by `categoryId` and `documentId`.
- Citation `documentId` and `categoryId` should match these same ids if the frontend later deep-links citations to documents.

## Theme and UI Style

Central theme file: `src/theme/colors.ts`

Current color tokens:

```ts
background: '#0F1115'
surface: '#171A21'
elevated: '#1E2430'
border: '#2A3242'
accent: '#1E6FD9'
accentHover: '#2A81F0'
textPrimary: '#F3F6FC'
textMuted: '#A4B0C0'
success: '#27AE60'
danger: '#D9534F'
```

The whole app currently renders as a dark UI regardless of Expo `userInterfaceStyle`.

Backend implication:

- Error messages and empty states should be short enough to fit in chat bubbles/cards.
- Long legal answers can render, but the frontend currently has no markdown renderer. Return plain text unless markdown rendering is added.

## API Client Already Present

File: `src/services/ragClient.ts`

The frontend has typed functions for these endpoints:

```txt
POST /chat
GET /chats
GET /law/categories
GET /law/categories/:categoryId/documents
GET /law/documents/:documentId
GET /citations/:citationId
```

Only `POST /chat` is currently used by a screen.

All requests send:

```http
Accept: application/json
Content-Type: application/json
```

Error behavior:

- If `response.ok` is false, the client reads `response.text()`.
- It throws `ApiError(message, status)`.
- `ChatScreen` currently catches all errors generically and does not display backend error details.

Backend implication:

- For now, any non-2xx response becomes a generic assistant error bubble.
- Later, if frontend wants precise error UI, backend should return stable JSON errors and frontend should parse them.

Recommended backend error shape:

```json
{
  "error": {
    "code": "MODEL_TIMEOUT",
    "message": "The model took too long to respond. Please try again."
  }
}
```

## API Types Expected By Frontend

File: `src/types/api.ts`

Chat request:

```ts
interface RagChatRequest {
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

Chat response:

```ts
interface RagChatResponse {
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

Chat history list response:

```ts
interface ChatSummaryResponse {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}
```

Law category response:

```ts
interface LawCategoryResponse {
  id: string;
  icon?: string;
  name: string;
  description: string;
  documentCount: number;
}
```

Law document summary response:

```ts
interface LawDocumentSummaryResponse {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  year: string;
  pages?: number;
  size?: string;
}
```

Law document detail response:

```ts
interface LawDocumentResponse extends LawDocumentSummaryResponse {
  content: string;
  pdfUrl?: string;
  fileUrl?: string;
  downloadUrl?: string;
}
```

## Current Feature Inventory

### Authentication: Login

File: `src/screens/LoginScreen.tsx`

Current UI:

- Brand row with scale icon and text `LawKH`.
- Tagline: `Intelligent Legal Research Assistant`.
- Email field:
  - Placeholder: `you@lawfirm.com`
  - Keyboard type: email address
  - Auto capitalization disabled
- Password field:
  - Secure text entry
  - Placeholder uses bullet characters
- `Forgot password?` link.
- `Sign In` button.
- Footer: `Don't have an account? Sign up`.

Current behavior:

- Email and password are stored only in local React state.
- Pressing `Sign In` does nothing if email or password is empty after trim.
- If both fields are non-empty, frontend navigates with `navigation.replace('MainTabs')`.
- No backend request is made.
- No token/session is created.
- No auth persistence exists.
- No invalid credential state exists.

Backend needed later:

```txt
POST /auth/login
```

Suggested request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Suggested response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "user_123",
    "name": "Admin User",
    "email": "user@lawkh.com"
  }
}
```

Frontend work still needed:

- Add auth service.
- Store token securely for native app.
- Attach bearer token to API calls.
- Show validation/backend errors.
- Add logout token clearing.

### Authentication: Sign Up

File: `src/screens/SignUpScreen.tsx`

Current UI:

- Title: `Create your account`
- Fields:
  - Full name
  - Email
  - Password
- `Create Account` button.
- `Back to login` link.

Current behavior:

- Name, email, and password are local state only.
- Pressing `Create Account` does nothing if any field is empty after trim.
- If all fields are non-empty, frontend navigates with `navigation.replace('MainTabs')`.
- No backend request is made.
- No validation beyond non-empty fields.

Backend needed later:

```txt
POST /auth/signup
```

Suggested request:

```json
{
  "name": "Admin User",
  "email": "user@lawkh.com",
  "password": "password"
}
```

Suggested response can match login.

### Authentication: Forgot Password

File: `src/screens/ForgotPasswordScreen.tsx`

Current UI:

- Title: `Forgot Password?`
- Subtitle: `Enter your email and we will send a reset link.`
- Email field.
- `Send Reset Link` button.
- `Back to login` link.

Current behavior:

- Email is local state only.
- Pressing `Send Reset Link` always navigates to `ResetPassword`.
- It does not require a non-empty email.
- No backend request is made.
- No email is actually sent.

Backend needed later:

```txt
POST /auth/password/forgot
```

Suggested request:

```json
{
  "email": "user@lawkh.com"
}
```

Suggested response:

```json
{
  "ok": true
}
```

Security note:

- Backend should avoid revealing whether an email exists.

### Authentication: Reset Password

File: `src/screens/ResetPasswordScreen.tsx`

Current UI:

- Title: `Reset Password`
- New password field.
- Confirm password field.
- `Reset Password` button.
- `Back to sign in` link.

Current behavior:

- Passwords are local state only.
- Submit does nothing if password is empty or password and confirmation do not match.
- If valid locally, frontend navigates with `navigation.replace('Login')`.
- No reset token is handled.
- No backend request is made.

Backend needed later:

```txt
POST /auth/password/reset
```

Suggested request:

```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

Frontend work still needed:

- Decide how reset token enters app: email deep link, web route, manual code, etc.

## Main Tabs

### Chat Tab

File: `src/screens/ChatScreen.tsx`

This is currently the only screen wired to the backend.

Header behavior:

- Shows LawKH brand with scale icon.
- Shows chat title under brand.
- If `navigation.canGoBack()` is true, shows a back button.
- Title is:
  - `New Chat` when no `chatId` route param exists.
  - Mock saved chat title when `chatId` matches `savedChats`.
  - `New Chat` fallback if `chatId` is unknown.

Empty state:

- Displays: `How can I assist with your legal research?`
- Shows four prompt suggestion cards from mock data:
  - `Summarize key points of a merger agreement`
  - `Explain fiduciary duty in corporate law`
  - `Find precedents on non-compete clauses`
  - `Draft a confidentiality agreement outline`
- Tapping a prompt only fills the input. It does not auto-send.
- Shows link text: `View history from the History tab`
- Tapping that link navigates to `MainTabs`. Because Chat is already inside tabs, this behavior is not especially useful; it does not specifically switch to History.

Input behavior:

- Text input placeholder: `Ask a legal question...`
- While generating, placeholder changes to `Generating answer...`
- While generating, input is disabled.
- Send button is disabled when input is empty or request is active.
- Send button icon is `send`.

Message rendering:

- User messages align right.
- Assistant messages align left.
- User bubble background uses accent blue.
- Assistant bubble background uses elevated surface.
- Messages render plain text only.
- There is no markdown renderer.
- There is no copy button.
- There is no retry button.
- There is no streaming display.
- There is no persisted scroll position.

Current request flow:

1. User types a question.
2. User presses send.
3. Frontend trims input.
4. If question is empty or already generating, it stops.
5. Frontend creates a local user message:

```ts
{
  id: String(Date.now()),
  type: 'user',
  content: question
}
```

6. Frontend appends the user message optimistically.
7. Frontend clears the input.
8. Frontend sets `isGenerating` to true.
9. Frontend calls `askRagQuestion`.
10. On success:
    - Stores `response.chatId` in `activeChatId`.
    - Appends an assistant message with `response.answer`.
    - Maps backend citations to the older frontend citation shape.
11. On failure:
    - Appends assistant message:

```txt
I could not reach the legal assistant backend. Please check your connection and try again.
```

12. Finally sets `isGenerating` to false.

Exact current `/chat` request body:

```json
{
  "question": "The user's latest question",
  "chatId": "optional-current-active-chat-id",
  "history": [
    {
      "role": "user",
      "content": "Previous user message"
    },
    {
      "role": "assistant",
      "content": "Previous assistant message"
    }
  ]
}
```

Important detail:

- The latest user message is sent as `question`, not included in `history`.
- `history` is built from `messages` before appending the latest user message.
- Frontend uses `message.type === 'user' ? 'user' : 'assistant'`.
- Existing frontend model calls assistant messages `ai`, but API history sends role `assistant`.

Expected `/chat` success response:

```json
{
  "chatId": "chat_123",
  "answer": "Plain text answer.",
  "citations": [
    {
      "id": "cite_001",
      "title": "Law on Taxation",
      "fullCitation": "Law on Taxation, Article 2",
      "documentId": "tax-1",
      "categoryId": "tax",
      "page": 4,
      "excerpt": "Taxpayers must maintain accurate records and timely filings.",
      "score": 0.82
    }
  ]
}
```

Current citation behavior in chat:

- Frontend only keeps citation `title` and `fullCitation` when converting backend response into the local `Message` type.
- `id`, `documentId`, `categoryId`, `page`, `excerpt`, and `score` are currently discarded by `ChatScreen`.
- Citation pills show:

```txt
[1] Citation Title
```

- Tapping a pill opens `CitationModal` with only `fullCitation`.

Backend implication:

- For the current UI, `title` and `fullCitation` are the only visible citation fields.
- Still return all structured citation fields now so the frontend can later upgrade the modal without changing backend.
- `fullCitation` should be a stable human-readable source label.
- `title` should be short enough for a pill.

Critical current limitation:

- The chat state is not persisted.
- If user leaves `New Chat`, newly generated messages disappear.
- `activeChatId` exists only in component state.
- History screen does not read backend-created chats yet.

Backend recommendation:

- `/chat` should create a new chat when `chatId` is absent.
- `/chat` should append to an existing chat when `chatId` is present.
- `/chat` should return the stable `chatId` every time.
- Backend should store chat messages if history persistence is desired.

### History Tab

File: `src/screens/HistoryScreen.tsx`

Current state: fully mock/local.

Current UI:

- Title: `Chat History`
- Search input:
  - Placeholder: `Search history`
  - Search icon
- Sectioned list grouped by:
  - `This Week`
  - `This Month`
  - `Earlier`
- Each history card displays:
  - title
  - preview
  - date
  - chevron forward icon
- Empty list text:

```txt
No history found for this query.
```

Current behavior:

- Reads `historyItems` from `src/data/mockData.ts`.
- Filters locally by lowercased `title + preview`.
- Filter is substring matching.
- Groups are hardcoded and ordered.
- Tapping item navigates:

```ts
navigation.navigate('ChatDetail', { chatId: item.id })
```

- `ChatDetail` reuses `ChatScreen`.
- `ChatScreen` then loads messages from mock `savedChats` by id.
- History item ids `1` and `2` currently match `savedChats`.
- History item ids `3` and `4` do not have matching `savedChats`, so tapping them opens a `New Chat` title with no messages.

Backend endpoint already scaffolded:

```txt
GET /chats
```

Expected frontend type:

```ts
interface ChatSummaryResponse {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}
```

Backend should eventually support:

- List chats for current user.
- Return stable ids.
- Return display title.
- Return preview text.
- Return update timestamp.
- Ideally return enough data for frontend to group by date.

Missing endpoint not currently scaffolded but likely needed:

```txt
GET /chats/:chatId
```

Reason:

- `GET /chats` gives summaries only.
- `ChatDetail` needs the full message list for a selected chat.
- Current frontend uses mock `savedChats` for details.

Suggested chat detail response:

```json
{
  "id": "chat_123",
  "title": "Tax rate for shop business",
  "updatedAt": "2026-05-06T02:00:00.000Z",
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Law regarding tax rate for a shop business",
      "createdAt": "2026-05-06T02:00:00.000Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "Answer text",
      "citations": []
    }
  ]
}
```

### Law Library Tab

File: `src/screens/LawLibraryScreen.tsx`

Current state: fully mock/local.

Current UI:

- Title: `Law Library`
- Subtitle: `Browse legal categories and documents`
- Two-column grid of category cards.
- Each category card shows:
  - icon
  - category name
  - description
  - document count badge in format `<number> docs`

Current mock categories:

```txt
tax
business-registration
labour
finance
banking
cdc
```

Displayed category names:

- Tax Law
- Business Registration
- Labour Law
- Finance Law
- Banking Law
- CDC

Current behavior:

- Reads `lawCategories` from mock data.
- Tapping a category navigates:

```ts
navigation.navigate('LawDocumentList', {
  categoryId: item.id,
  categoryName: item.name
})
```

Backend endpoint already scaffolded:

```txt
GET /law/categories
```

Expected frontend type:

```ts
interface LawCategoryResponse {
  id: string;
  icon?: string;
  name: string;
  description: string;
  documentCount: number;
}
```

Backend requirements:

- `id` must be stable and URL-safe.
- `name` should be display-ready.
- `description` should be short, ideally one line on mobile.
- `documentCount` must be accurate if shown.
- `icon` is optional in API type, but current UI expects an icon in mock model. If replacing the screen with API data, frontend should provide fallback icon if missing.

### Law Document List Screen

File: `src/screens/LawDocumentListScreen.tsx`

Current state: fully mock/local.

Route params:

```ts
{
  categoryId: string;
  categoryName: string;
}
```

Current UI:

- Back button.
- Category name as title.
- Search input:
  - Placeholder: `Search documents`
  - Search icon
- List of document cards.
- Each document card shows:
  - document title
  - subtitle
  - metadata line:

```txt
<year> • <pages> pages • <size>
```

Current behavior:

- Reads `documentsByCategory[categoryId]` from mock data.
- If category id is unknown, uses empty list.
- Search filters locally by lowercased `title + subtitle`.
- Tapping document navigates:

```ts
navigation.navigate('LawDocumentViewer', {
  categoryId,
  documentId: item.id
})
```

Backend endpoint already scaffolded:

```txt
GET /law/categories/:categoryId/documents
```

Expected frontend type:

```ts
interface LawDocumentSummaryResponse {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  year: string;
  pages?: number;
  size?: string;
}
```

Backend requirements:

- `id` must be stable and match citation `documentId`.
- `categoryId` must match the selected category.
- `title` should be display-ready.
- `subtitle` should be a concise description.
- `year` is a string, not a number.
- `pages` is optional in API type but currently displayed by UI.
- `size` is optional in API type but currently displayed by UI.

Frontend work still needed:

- API loading state.
- Empty category state.
- Backend error state.
- Fallback rendering when `pages` or `size` is missing.
- Decide whether search remains local or goes to backend.

### Law Document Viewer Screen

File: `src/screens/LawDocumentViewerScreen.tsx`

Current state: fully mock/local.

Route params:

```ts
{
  categoryId: string;
  documentId: string;
}
```

Current UI when document exists:

- Back button.
- Document title.
- Metadata:

```txt
<year> • <pages> pages • <size>
```

- Action pills:
  - Download
  - Share
  - Bookmark
- Document body in a bordered surface.

Current behavior:

- Looks up document in `documentsByCategory[categoryId]` by `documentId`.
- If found, displays the mock `content` string.
- The content string includes escaped line breaks in mock data.
- Action pills are visual only:
  - Download has no handler.
  - Share has no handler.
  - Bookmark has no handler.

Current UI when document is missing:

- Shows `Document not found`.
- Shows `Go back` button.

Backend endpoint already scaffolded:

```txt
GET /law/documents/:documentId
```

Expected frontend type:

```ts
interface LawDocumentResponse {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  year: string;
  pages?: number;
  size?: string;
  content: string;
}
```

Backend requirements:

- Return plain text `content` for current frontend.
- Return `pdfUrl`, `fileUrl`, or `downloadUrl` if the frontend should embed/open the original PDF.
- If those fields are absent, the frontend currently falls back to `GET /law/documents/{documentId}/download`.
- On Expo web, the frontend renders the PDF URL inline in the document viewer.
- On native APK, the current frontend opens the PDF URL through the system/browser until a native PDF viewer is added.
- If returning markdown or HTML later, frontend must add a renderer first.
- Include `categoryId` so citations and category navigation stay consistent.
- If documents are large, consider paginated content or signed file URLs later.

Possible future endpoints:

```txt
GET /law/documents/:documentId/download
POST /law/documents/:documentId/bookmark
DELETE /law/documents/:documentId/bookmark
```

### Citation Modal

File: `src/components/CitationModal.tsx`

Current state: partially connected through chat, but details are still mock/local.

Current props:

```ts
{
  citation: string;
  onClose: () => void;
}
```

Current UI:

- Bottom sheet modal.
- Dark backdrop.
- Header: `Citation Detail`
- Close icon.
- Displays citation string in accent color.
- Displays body text from mock `citationDetails[citation]`.
- If no matching local mock detail exists:

```txt
No detailed citation entry found.
```

Current behavior:

- Modal opens when `selectedCitation` is non-null.
- Backdrop press closes modal.
- Close icon closes modal.
- Pressing inside sheet does not close modal.

Backend endpoint already scaffolded:

```txt
GET /citations/:citationId
```

But current UI cannot use it yet because:

- `ChatScreen` discards `citation.id`.
- `CitationModal` receives only `fullCitation`, not full citation object.
- `CitationModal` reads details from local mock data.

Backend recommendation:

- Return rich citation objects from `/chat` now.
- Keep citation ids stable.
- Include excerpt in `/chat` if possible so frontend can show details without another request.
- Support `GET /citations/:citationId` later for full detail.

Suggested full citation detail:

```json
{
  "id": "cite_001",
  "title": "Law on Taxation",
  "fullCitation": "Law on Taxation, Article 2",
  "documentId": "tax-1",
  "categoryId": "tax",
  "page": 4,
  "excerpt": "Taxpayers must maintain accurate records and timely filings.",
  "score": 0.82
}
```

### Account Tab

File: `src/screens/AccountScreen.tsx`

Current state: fully local.

Current UI:

- Title: `Account`
- Profile card:
  - Circular avatar with initials derived from user name.
  - Name text.
  - Email text.
  - Edit icon.
- Rows:
  - Privacy & Security
  - Terms & Conditions
  - Help & Support
  - Dark Theme switch
- Log Out button.

Current hardcoded defaults:

```txt
userName = Admin User
email = user@lawkh.com
darkMode = true
```

Current behavior:

- Edit icon opens `EditProfileModal`.
- Saving profile updates local `userName` only.
- Avatar initials are built by splitting `userName` on spaces and joining first letters.
- Email is hardcoded and cannot be edited.
- Dark Theme switch toggles local `darkMode` state only. It does not change app theme.
- Logout navigates with `navigation.replace('Login')`.
- No backend calls.
- No token clearing.

Backend needed later:

```txt
GET /me
PATCH /me
POST /auth/logout
```

Suggested user response:

```json
{
  "id": "user_123",
  "name": "Admin User",
  "email": "user@lawkh.com",
  "preferences": {
    "darkMode": true
  }
}
```

### Edit Profile Modal

File: `src/components/EditProfileModal.tsx`

Current UI:

- Centered modal card.
- Header: `Edit Profile`
- Close icon.
- Label: `Full Name`
- Text input placeholder: `Your name`
- Buttons:
  - Cancel
  - Save

Current behavior:

- Internal `name` state resets to incoming `userName` whenever `userName` changes.
- Save does nothing if trimmed name is empty.
- On save:
  - Calls parent `onSave(name.trim())`.
  - Closes modal.
- No backend request.

Backend needed later:

```txt
PATCH /me
```

Suggested request:

```json
{
  "name": "New Name"
}
```

### Privacy and Security Screen

File: `src/screens/PrivacySecurityScreen.tsx`

Current state: static content only.

Current UI:

- Back button.
- Title: `Privacy & Security`
- Card: `Password & Authentication`
  - `Change Password`
  - `Two-Factor Authentication: Off`
- Card: `Data Privacy`
  - `Data Sharing Settings`
  - `Privacy Controls`
  - `Download My Data`

Current behavior:

- Back button navigates back.
- Items are plain text, not pressable.
- No backend calls.

Potential backend later:

```txt
POST /auth/password/change
GET /me/security
PATCH /me/security
GET /me/export
```

### Terms and Conditions Screen

File: `src/screens/TermsConditionsScreen.tsx`

Current state: static content only.

Current UI/content:

- Back button.
- Title: `Terms & Conditions`
- Last updated: `March 20, 2026`
- Sections:
  - `1. Introduction`
  - `2. Use of Service`
  - `3. Legal Disclaimer`
  - `4. Privacy`

Current behavior:

- Static scrollable text.
- No backend calls.

Potential backend later:

```txt
GET /legal/terms
```

### Help and Support Screen

File: `src/screens/HelpSupportScreen.tsx`

Current state: mostly static.

Current UI:

- Back button.
- Title: `Help & Support`
- Cards:
  - Email Support
  - Live Chat
  - FAQ

Current behavior:

- Email Support opens:

```txt
mailto:support@lawkh.app
```

- Live Chat card has no action.
- FAQ card has no action.
- No backend calls.

Potential backend later:

```txt
GET /support/faq
POST /support/tickets
```

## Current Mock Data Dependencies

File: `src/data/mockData.ts`

Current frontend still depends on mock data for:

- Saved chat detail loading.
- Prompt suggestions.
- History list.
- Law categories.
- Law document summaries and content.
- Citation modal detail lookup.

Mock saved chats:

- Chat `1`: `Contract Review Q&A`
- Chat `2`: `Non-Compete Clauses`

Mock history items:

- `1`, this week, matches saved chat `1`.
- `2`, this week, matches saved chat `2`.
- `3`, this month, no saved chat detail.
- `4`, earlier, no saved chat detail.

Mock law categories and first document ids:

```txt
tax -> tax-1
business-registration -> biz-1
labour -> lab-1
finance -> fin-1
banking -> bank-1
cdc -> cdc-1
```

Mock citation details only support:

```txt
UCC § 2-302 (Unconscionability)
Restatement (Second) of Contracts § 208
Cal. Bus. & Prof. Code § 16600
Edwards v. Arthur Andersen LLP, 44 Cal.4th 937 (2008)
```

Backend implication:

- Current citation modal will show fallback text for new backend citations unless frontend is updated to keep and display backend citation details.

## Backend Endpoint Priority

## Available Backend Endpoints and Remaining Frontend Integration

The backend already provides the endpoints listed in this section. The remaining work is on the frontend: call these endpoints from the current screens, store/use the returned access token, and replace mock/local data flows.

### Auth Integration

Backend endpoints already available:

```txt
POST /auth/signup
POST /auth/login
POST /auth/password/forgot
POST /auth/password/reset
```

Frontend work needed:

- `SignUpScreen` should call `POST /auth/signup`.
- `LoginScreen` should call `POST /auth/login`.
- `ForgotPasswordScreen` should call `POST /auth/password/forgot`.
- `ResetPasswordScreen` should call `POST /auth/password/reset`.
- After successful signup or login, store the returned access token securely.
- Use the stored token for authenticated requests.

Suggested login/signup success response:

```json
{
  "accessToken": "jwt_or_session_token",
  "user": {
    "id": "user_123",
    "name": "Admin User",
    "email": "user@lawkh.com"
  }
}
```

Frontend token storage requirement:

- Native Android/iOS: use secure storage, not normal React state only.
- Expo-friendly option: `expo-secure-store`.
- Web fallback may require local/session storage or a separate web auth strategy.
- Current frontend does not yet have secure token storage.

Authenticated requests should include:

```http
Authorization: Bearer <token>
```

Send the token to:

```txt
GET /auth/me
GET /me
POST /chat
GET /chats
GET /chats/{chatId}
```

Auth endpoint expectations:

```txt
POST /auth/signup
```

Request:

```json
{
  "name": "Admin User",
  "email": "user@lawkh.com",
  "password": "password"
}
```

```txt
POST /auth/login
```

Request:

```json
{
  "email": "user@lawkh.com",
  "password": "password"
}
```

```txt
POST /auth/password/forgot
```

Request:

```json
{
  "email": "user@lawkh.com"
}
```

```txt
POST /auth/password/reset
```

Request:

```json
{
  "token": "reset_token_or_code",
  "password": "new_password"
}
```

Frontend needs to match the backend's implemented password reset flow:

- emailed link with reset token,
- numeric/email code,
- temporary token returned during development,
- or another flow.

### Current User/Profile Integration

Backend endpoints already available:

```txt
GET /auth/me
GET /me
```

Frontend work needed:

- Load current user/profile data after login or app startup.
- Decide whether the frontend should use `/auth/me`, `/me`, or both based on the backend's intended split.
- Replace hardcoded account data with the backend user payload.

Suggested response:

```json
{
  "id": "user_123",
  "name": "Admin User",
  "email": "user@lawkh.com",
  "preferences": {
    "darkMode": true
  }
}
```

The Account screen should eventually replace hardcoded:

```txt
Admin User
user@lawkh.com
```

with backend user data.

### Chat Integration

Backend endpoint already available:

```txt
POST /chat
```

Auth behavior:

- Authentication is optional for `/chat`.
- If no token exists, the frontend may still call `/chat` for guest chat.
- If a token exists, the frontend must include `Authorization: Bearer <token>`.
- Backend should persist chat history only when a valid logged-in user token is provided.
- Backend may still return a temporary `chatId` for guest sessions, but persistence expectations should be lower.

Current frontend already calls `/chat`.

Frontend work still needed:

- Attach `Authorization: Bearer <token>` when a token exists.
- Keep allowing guest chat when no token exists, if the backend supports it.
- Confirm that persisted history appears only for authenticated chat calls.

### Chat History Integration

Backend endpoints already available:

```txt
GET /chats
GET /chats/{chatId}
```

Frontend also includes a delete button in the History tab and expects:

```txt
DELETE /chats/{chatId}
```

Expected behavior:

- Requires `Authorization: Bearer <token>`.
- Deletes or soft-deletes the chat for the current user.
- Returns `204 No Content` or a small JSON success response.
- If the chat does not belong to the user, return `403` or `404`.

Auth behavior:

- These should require `Authorization: Bearer <token>`.
- If user is not logged in, frontend should show an empty/login-required history state.

Frontend work needed:

- Replace mock `historyItems` with `GET /chats`.
- Replace mock `savedChats` detail loading with `GET /chats/{chatId}`.
- Attach `Authorization: Bearer <token>`.
- Show an empty/login-required state if the user is not logged in.

Expected usage:

- `GET /chats` returns summaries for the History tab.
- `GET /chats/{chatId}` returns full messages for the selected chat detail.

### Law Library Integration

Backend endpoints already available:

```txt
GET /law/categories
GET /law/categories/{categoryId}/documents
GET /law/documents/{documentId}
```

Auth behavior:

- These can be public unless backend wants document access restricted.
- If public, no `Authorization` is required.
- If a token exists, it is still acceptable for frontend to include it consistently.

Frontend work needed:

- `LawLibraryScreen` uses `GET /law/categories`.
- `LawDocumentListScreen` uses `GET /law/categories/{categoryId}/documents`.
- `LawDocumentViewerScreen` uses `GET /law/documents/{documentId}`.
- Replace `lawCategories` and `documentsByCategory` mock reads.
- Add loading, empty, and backend error states.

### Environment Configuration

Expo frontend should point to the backend through:

```txt
EXPO_PUBLIC_API_BASE_URL
```

Examples:

```txt
Android emulator: EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000
Expo web same machine: EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
Physical phone local backend: EXPO_PUBLIC_API_BASE_URL=http://<host-lan-ip>:8000
Deployed backend: EXPO_PUBLIC_API_BASE_URL=https://<backend-domain>
```

Important:

- Expo public env vars are bundled at build time for APK builds.
- Changing backend URL for an APK requires rebuilding the APK.
- Dev web sessions can be restarted with a different `EXPO_PUBLIC_API_BASE_URL`.

## Legal Document Source Bundles

The project has original legal document ZIP bundles outside the frontend repo:

```txt
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\tax.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\Banking.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\CouncilForDevelopmentOfCambodia.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\Finance.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\labour.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\LawDocuments.zip
D:\Users\aykay\SProjects\KhmerOCR\Original Materials\RegistrationBusiness.zip
```

Observed ZIP entry counts:

```txt
tax.zip: 40 entries
Banking.zip: 162 entries
CouncilForDevelopmentOfCambodia.zip: 198 entries
Finance.zip: 471 entries
labour.zip: 237 entries
LawDocuments.zip: 263 entries
RegistrationBusiness.zip: 87 entries
```

These source bundles map naturally to the current Law Library categories:

```txt
tax.zip -> tax / Tax Law
Banking.zip -> banking / Banking Law
CouncilForDevelopmentOfCambodia.zip -> cdc / CDC
Finance.zip -> finance / Finance Law
labour.zip -> labour / Labour Law
RegistrationBusiness.zip -> business-registration / Business Registration
LawDocuments.zip -> general legal documents or an additional category, depending on backend taxonomy
```

Ownership decision:

- Extracting ZIPs is backend/data-pipeline work.
- OCR cleanup is backend/data-pipeline work.
- PDF/text parsing is backend/data-pipeline work.
- Metadata extraction is backend/data-pipeline work.
- Chunking and embedding are backend/data-pipeline work.
- Vector indexing is backend/data-pipeline work.
- Document storage is backend/data-pipeline work.
- Citation source mapping is backend/RAG work.
- The frontend should not bundle these ZIPs or raw PDFs inside the app.

Reason:

- APK size would become large and brittle.
- Legal source documents need stable ids and metadata controlled by the backend.
- RAG retrieval needs chunks, embeddings, source page/section mapping, and citation traceability.
- Updating legal documents should not require rebuilding the APK.
- The same document corpus should serve web, APK, Telegram bot, and any future admin tool.

Backend should ingest these bundles into a document catalog with stable ids. A recommended document model:

```ts
interface LegalDocumentRecord {
  id: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  originalFileName: string;
  sourcePath?: string;
  language?: 'km' | 'en' | 'mixed';
  year?: string;
  pages?: number;
  size?: string;
  mimeType: 'application/pdf' | 'text/plain' | string;
  contentText?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

Recommended chunk model for RAG:

```ts
interface LegalDocumentChunk {
  id: string;
  documentId: string;
  categoryId: string;
  chunkIndex: number;
  text: string;
  pageStart?: number;
  pageEnd?: number;
  sectionTitle?: string;
  embeddingId?: string;
  metadata: {
    title: string;
    originalFileName: string;
    language?: string;
  };
}
```

Backend should expose the ingested catalog through the already planned endpoints:

```txt
GET /law/categories
GET /law/categories/:categoryId/documents
GET /law/documents/:documentId
```

Backend should use the same ids in chat citations:

```json
{
  "id": "cite_001",
  "title": "Law on Taxation",
  "fullCitation": "Law on Taxation, Article 2",
  "documentId": "tax-law-on-taxation-2023",
  "categoryId": "tax",
  "page": 4,
  "excerpt": "Taxpayers must maintain accurate records and timely filings.",
  "score": 0.82
}
```

For the current frontend, document access in the Law Library tab needs backend document metadata and text. The current app only displays:

```txt
category: icon, name, description, documentCount
document list item: title, subtitle, year, pages, size
document viewer: title, year, pages, size, content
```

Therefore the backend can start simple:

1. Ingest ZIP files into categories.
2. Store each PDF as one document record.
3. Extract enough text to populate `content`.
4. Return document metadata through the law endpoints.
5. Use the same documents/chunks for `/chat` retrieval and citations.

Do not make the frontend responsible for uploading, extracting, parsing, OCR, or indexing these ZIP files.

### Priority 1: Already Used

```txt
POST /chat
```

Must work now.

Minimum behavior:

- Accept `question`, optional `chatId`, and `history`.
- Return `chatId`, `answer`, and `citations`.
- Return plain text answer.
- Return citations array, even if empty.

### Priority 2: Needed To Replace Mock History

```txt
GET /chats
GET /chats/:chatId
```

`GET /chats/:chatId` is not currently in `ragClient.ts`, but the UI will need it to load selected chat messages from the History tab.

### Priority 3: Needed To Replace Mock Law Library

```txt
GET /law/categories
GET /law/categories/:categoryId/documents
GET /law/documents/:documentId
```

### Priority 4: Needed For Rich Citation UX

```txt
GET /citations/:citationId
```

Frontend needs a small refactor first to preserve citation ids and pass full citation objects.

### Priority 5: Auth/Profile

Currently no auth endpoint is used.

Likely future endpoints:

```txt
POST /auth/login
POST /auth/signup
POST /auth/password/forgot
POST /auth/password/reset
POST /auth/logout
GET /me
PATCH /me
```

## Data Persistence Expectations

Current frontend persistence:

- None.
- Chat messages are component state.
- Edited profile name is component state.
- Dark mode switch is component state.
- Login state is navigation state only.

Backend persistence needed for real product:

- User accounts.
- Auth sessions/tokens.
- Chat sessions.
- Chat messages.
- Citation metadata linked to answer messages.
- Law category/document metadata.
- Document content or file references.
- Optional user bookmarks.
- Optional profile/preferences.

## Current Gaps Backend Should Know About

- Frontend has no auth headers yet.
- Frontend has no token storage yet.
- Frontend has no refresh-token flow.
- Frontend has no global API error handling.
- Frontend has no loading states for history/library/document pages.
- Frontend has no backend-driven profile data.
- Frontend has no file download implementation.
- Frontend has no share implementation.
- Frontend has no bookmark implementation.
- Frontend has no markdown rendering.
- Frontend has no streaming chat support.
- Frontend has no cancel generation button.
- Frontend has no retry failed message button.
- Frontend has no persisted chat state.
- Frontend has no citation deep link to documents.
- Frontend has no document page jump support.
- Frontend has no search endpoint integration.

## Recommended Backend Response Rules

For `/chat`:

- Always return JSON.
- Always return `citations`, even if `[]`.
- Keep `answer` as plain text for now.
- Keep `chatId` stable.
- Do not include secrets or internal prompts.
- If model fails, return a stable error object and a non-2xx status.
- If retrieval finds no source, either return an empty citation array or cite a general source only if it is genuinely used.

For law documents:

- Keep ids stable forever once citations reference them.
- Make `documentId` and `categoryId` URL-safe.
- Return metadata separately from heavy document content where possible.

For dates:

- Prefer ISO strings from backend.
- Frontend can later format them into `Today`, `Yesterday`, `This Week`, etc.

For text:

- The current UI expects display-ready text.
- Avoid huge unbroken strings because mobile text wrapping can become ugly.

## Suggested Near-Term Frontend/Backend Alignment Plan

1. Stabilize `POST /chat`.
2. Update frontend `CitationModal` to accept full `RagCitation`.
3. Add `GET /chats/:chatId` to client.
4. Replace mock `HistoryScreen` with `GET /chats`.
5. Replace mock chat detail loading with `GET /chats/:chatId`.
6. Replace law library screens with the law endpoints.
7. Add auth/token handling only when backend auth is ready.
8. Add streaming only after non-streaming chat is reliable.
