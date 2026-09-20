# MentosAI

**A secure, personalized AI workspace that transforms one source into many useful formats.**

Built by Team KALKI for Smart India Hackathon 2026 — Problem Statement SIH26154 (National Technical Research Organisation).

MentosAI accepts reports, documents, images, links, and prompts; extracts grounded context; and creates multiple ready-to-use outputs in parallel. Users can refine an output manually or with AI, retain an auditable history, and verify a cryptographic tamper-evident seal for each generation.

## Problem

Teams often need to convert one report, advisory, incident log, article, or research document into several communications. Doing that manually is slow, inconsistent, and requires both domain and writing expertise.

MentosAI provides one controlled workflow: upload once, select formats, configure the audience and tone, then review, edit, download, and verify the resulting artifacts.

## Features

- **Multi-source input:** pasted text, URLs, PDFs, Office documents, images, and supported audio/video files.
- **Nine outputs:** LinkedIn post, X/Twitter thread, advisory, executive summary, presentation, infographic, video package, threat-intelligence brief, and smart-contract audit.
- **Parallel generation:** requested formats are created from one shared source context.
- **Context extraction:** summary, intent, key points, entities, CVEs, domain, source category, and risk severity.
- **Large-document processing:** long material is chunked and summarized before generation.
- **Grounding checks:** outputs are checked against extracted source facts for possible hallucinations.
- **Personalized defaults:** role, organisation, audience, tone, language, detail level, and video duration are saved for each user.
- **Editable outputs:** users can directly edit text, ask AI for a revision, and retain output versions.
- **URL-based history:** each generation opens at `/c/:jobId`; past work is searchable in history.
- **Protected exports:** download access requires sign-in and ownership of the job.
- **Audit ledger:** source/output hashes are linked to a persistent cryptographic chain and can be verified later.

## User flow

```text
Sign in
  → first-time profile and generation preferences
  → add a source and select outputs
  → extract source context
  → generate and validate outputs in parallel
  → seal a cryptographic audit record
  → edit manually or request an AI revision
  → download securely or reopen from history
```

## Architecture

```text
React + Clerk workspace
  ├── /dashboard     New generation
  ├── /c/:id         Saved generation
  ├── /history       Prior generations
  └── /settings      Personalized defaults
          │
Express API + Clerk authentication
  ├── Preprocessing: files, pasted text, URLs, media
  ├── Context extraction: facts, entities, intent, risk
  ├── Orchestrator: parallel output generators
  ├── Validation: source-context consistency check
  ├── Formatter: TXT, PDF, PPTX, or image export
  └── Audit ledger: persistent cryptographic hash chain
          │
MongoDB: jobs, versions, user settings, ledger blocks
```

## Output formats

| Key | Output |
|---|---|
| `linkedin` | LinkedIn post |
| `twitter` | X/Twitter thread |
| `advisory` | Structured advisory |
| `execSummary` | Executive summary |
| `presentation` | Presentation outline and PPTX export |
| `infographic` | Infographic image |
| `videoPackage` | Video script/storyboard package |
| `threatIntel` | Threat-intelligence brief |
| `contractAudit` | Smart-contract security audit |

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, react-dropzone, lucide-react, React Markdown, Clerk.

**Backend:** Node.js, Express 5, MongoDB/Mongoose, Google Gemini (`@google/genai`), Multer, OfficeParser, PPTXGenJS, Puppeteer, YouTube Transcript Plus, Clerk, and Node.js cryptography.

## Project structure

```text
MentosAI/
├── client/
│   └── src/
│       ├── pages/          Dashboard, conversation, history, settings
│       ├── components/     Input, sidebar, preview, onboarding UI
│       ├── hooks/          Generation state
│       └── services/       API client
└── server/
    └── src/
        ├── controllers/    Generation, jobs, settings
        ├── middlewares/    Authentication and upload handling
        ├── models/         Job, user settings, ledger block
        ├── pipeline/       Preprocessing, context, generation, validation, export
        ├── routes/         API routes
        └── services/       Gemini and cryptographic ledger
```

## Local setup

### Prerequisites

- Node.js 20+
- MongoDB connection string
- Gemini API key
- Clerk application keys

### Backend

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Test it with `GET /health`.

### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
STRICT_REVERIFICATION=false
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## App routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/sign-in/*` | Public | Sign in |
| `/sign-up/*` | Public | Sign up |
| `/dashboard` | Signed in | New generation workspace |
| `/c/:id` | Signed in | One saved generation |
| `/history` | Signed in | Searchable generation history |
| `/settings` | Signed in | User defaults |

## API overview

All routes below require a valid Clerk bearer token.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/generate` | Create or resume a generation job |
| `GET` | `/api/jobs` | List the signed-in user's jobs |
| `GET` | `/api/jobs/:id` | Fetch one owned job |
| `PUT` | `/api/jobs/:id/outputs/:type` | Save a manual edit |
| `POST` | `/api/jobs/:id/outputs/:type/revise` | Revise an output with AI |
| `GET` | `/api/jobs/:id/outputs/:type/download` | Download an owned output |
| `GET` / `PUT` | `/api/settings` | Read or update preferences |
| `GET` | `/api/ledger/verify/:jobId` | Verify a job audit seal |
| `GET` | `/api/ledger/chain?limit=10` | View recent user ledger blocks |

### `POST /api/generate` fields

Submit multipart form data.

| Field | Description |
|---|---|
| `files` | Up to five source files; 50 MB maximum each |
| `sourceType` | `text`, `pdf`, `docx`, `sol`, `image`, `audio`, `video`, or `url` |
| `rawText` | Pasted source text or a URL |
| `outputTypes` | JSON array, e.g. `["linkedin","advisory"]` |
| `config` | JSON with tone, audience, language, detail level, and duration |
| `jobId` | Existing job ID when answering a clarification request |
| `clarificationAnswers` | Answer to an AI clarification question |
| `overrideClarification` | `true` to proceed with available source context |

## Audit ledger

MentosAI uses a **private, persistent cryptographic hash chain**; it is not a public cryptocurrency network.

Every completed job seals the retained source-text hash, original generated-output hash, validation score, CVE references, domain, timestamp, and previous-block hash. Verification checks ledger linkage and confirms that the retained source and original AI output still match their sealed hashes. User edits create later versions and do not rewrite the original sealed AI output.

## Testing

```bash
cd client
npm run lint
npm run build

cd ../server
npm test
```

## Current limitations

- Validation is AI-assisted and should support—not replace—expert review.
- Source text is retained privately per user to enable source-hash verification. A production deployment should add encryption and explicit retention/deletion controls.
- The private ledger is tamper-evident, not decentralized public-blockchain proof.
- LinkedIn URLs can be blocked by login and anti-bot restrictions; pasting post text is the reliable workflow.

---

Built for Smart India Hackathon 2026 by Team KALKI.
