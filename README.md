# MentosAI

**Turn one source into clear, audience-ready security and communication materials.**

MentosAI is an AI-assisted content workspace built by Team KALKI for Smart India Hackathon 2026, problem statement **SIH26154 (National Technical Research Organisation)**. It accepts source material, extracts a shared context, generates selected deliverables, checks them against the extracted facts, and keeps each job available for review and editing.

> AI-generated security content needs human review. Validation is an aid for spotting inconsistencies; it is not a substitute for expert analysis.

## Contents

- [What it does](#what-it-does)
- [Features](#features)
- [Supported inputs and outputs](#supported-inputs-and-outputs)
- [How a generation works](#how-a-generation-works)
- [Application pages](#application-pages)
- [Technology and architecture](#technology-and-architecture)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Project layout](#project-layout)
- [Security and audit notes](#security-and-audit-notes)
- [Known limitations](#known-limitations)

## What it does

Teams often need to turn an incident report, advisory, research document, article, or other source into several kinds of material. MentosAI puts that work into one flow: provide source material, select one or more output types, choose generation preferences, then review, edit, export, and revisit the results.

## Features

- **Multiple input paths:** paste text, provide a web or YouTube URL, or upload supported files.
- **Nine generated deliverables:** social posts, briefs, a presentation, infographic, video package, and smart-contract audit.
- **Shared source context:** extracts a summary, intent, key points, entities, CVE identifiers, domain, source category, and risk severity for the requested outputs.
- **Long-source processing:** large text is split into chunks and summarized before context extraction.
- **Parallel generation:** selected output generators run from the same extracted context.
- **Source-grounding review:** generated content receives an AI-assisted consistency check against extracted source facts.
- **Personal preferences:** onboarding and settings store profile information and defaults such as tone, language, detail level, audience, and video duration.
- **Manual and AI-assisted editing:** edit an output directly or request a revision in natural language. Edited versions are saved with the job.
- **History and shareable app routes:** each job has a `/c/:id` route and appears in the signed-in user's history.
- **Export and download:** generated content can be downloaded in its corresponding supported export format.
- **Cryptographic audit seal:** each completed job records hashes in a persistent, private hash chain. The app can verify the chain and compare stored source and original output content with their sealed hashes.
- **Authenticated, owner-scoped records:** job, settings, edit, revision, download, and ledger API routes require authentication and scope data to the signed-in user.

## Supported inputs and outputs

### Inputs

The backend accepts pasted text and URLs, plus up to five uploaded files per generation (50 MB maximum per file). File extraction is selected by file extension and includes:

| Input | Handling |
|---|---|
| PDF and Office documents (including DOCX, PPTX, XLSX, ODT, ODP, ODS, RTF) | Text extraction with OfficeParser |
| CSV, Markdown, EPUB, HTML | Text extraction with OfficeParser |
| JPG, JPEG, PNG, WEBP, GIF | Image-to-text description via Gemini |
| MP3, WAV, M4A, MP4, MOV, WEBM | Media transcription via Gemini File API |
| YouTube URL | Transcript extraction when available |
| Other web URL | Page retrieval and HTML text extraction |
| Pasted content | Passed to source preprocessing directly |

The current upload widget advertises PDF, DOCX, and images; the backend's extension-based parser supports the additional formats listed above. Actual extraction can depend on the file, URL accessibility, and provider availability.

### Outputs

| Key | Deliverable | Preview/export |
|---|---|---|
| `linkedin` | LinkedIn post | Text |
| `twitter` | X/Twitter thread | Text |
| `advisory` | Threat advisory | PDF |
| `execSummary` | Executive summary | PDF |
| `presentation` | Presentation content | PPTX |
| `infographic` | Infographic | Image |
| `videoPackage` | Narration script, storyboard, subtitles, and visual direction | Text; structured preview in app |
| `threatIntel` | Threat-intelligence brief | PDF |
| `contractAudit` | Smart-contract security audit | Text |

## How a generation works

```text
Sign in
  → set profile and preferences
  → paste, link, or upload source material
  → preprocess and summarize long sources
  → extract facts, entities, domain, and risk context
  → generate selected deliverables in parallel
  → validate outputs against extracted context
  → save the job and seal its source/output hashes
  → review, edit, revise, download, or reopen from history
```

If context extraction determines that essential information is missing, the API can return a clarification question. The client can resume the job with clarification answers or explicitly proceed with the available context.

## Application pages

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Product landing page |
| `/sign-in/*` | Public | Clerk sign-in |
| `/sign-up/*` | Public | Clerk sign-up |
| `/dashboard` | Signed in | Create a generation and review its outputs |
| `/c/:id` | Signed in | Open a saved generation |
| `/history` | Signed in | Find previous jobs |
| `/settings` | Signed in | Update profile and generation defaults |

## Technology and architecture

```text
React client (Vite, Tailwind CSS, React Router, Clerk)
  └── Express API (Clerk authentication)
       ├── Preprocessing: OfficeParser, Gemini, URL retrieval, YouTube transcripts
       ├── Context extraction and long-source chunking
       ├── Parallel generators and AI-assisted validation
       ├── Export formatting: TXT, PDF, PPTX, image
       ├── Job, settings, and ledger controllers
       └── MongoDB / Mongoose persistence
```

**Client:** React 19, Vite, Tailwind CSS, React Router, Axios, react-dropzone, lucide-react, React Markdown, Clerk.

**Server:** Node.js, Express 5, MongoDB/Mongoose, Google Gemini (`@google/genai`), Multer, OfficeParser, PPTXGenJS, Puppeteer, YouTube Transcript Plus, Clerk, and Node.js cryptography.

## Run locally

### Prerequisites

- Node.js 20 or newer
- MongoDB database and connection string
- Google Gemini API key
- Clerk application keys

### 1. Configure environment

Create `server/.env` and `client/.env` using the variables in [Environment variables](#environment-variables).

### 2. Start the API

```bash
cd server
npm install
npm run dev
```

The API defaults to `http://localhost:5000`; `GET /health` is the public health check.

### 3. Start the web client

In another terminal:

```bash
cd client
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

### Useful project scripts

```bash
# Client
npm run dev
npm run build
npm run lint

# Server
npm run dev
npm start
npm test
```

Run each command from its respective `client` or `server` directory.

## Deploy the frontend to Vercel

The frontend is a Vite single-page app. Create a Vercel project from this repository and set its **Root Directory** to `client`. Use the Vite framework preset, `npm run build` as the build command, and `dist` as the output directory. `client/vercel.json` routes app paths such as `/dashboard` and `/c/:id` back to the client so they work when opened directly.

Set these values under the Vercel project's Environment Variables for each deployment environment:

| Variable | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for the production Clerk application |
| `VITE_API_BASE_URL` | Public HTTPS origin of the separately deployed Express API, without a trailing slash |

Redeploy after adding or changing environment variables. The client build only exposes variables prefixed with `VITE_`; never put `CLERK_SECRET_KEY`, `GEMINI_API_KEY`, or `MONGO_URI` in the Vercel frontend project. Configure those secrets on the API host. The API must allow browser requests from the Vercel site, and the production site URL must be added to Clerk's allowed origins/redirect URLs. See [client/.env.example](client/.env.example) for the local client variable names.

Vercel hosts the frontend only with this setup. The Express API, MongoDB, Gemini credentials, and durable storage for generated export files need their own production hosting and configuration.

## Environment variables

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

Keep real credentials out of source control. `STRICT_REVERIFICATION=true` enables Clerk strict reverification for fetching an individual job when the session supports it.

## API reference

Except for `GET /health`, API routes require a valid Clerk bearer token. Generation requests use `multipart/form-data`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Public API health status |
| `POST` | `/api/generate` | Create a job or resume a clarification job |
| `GET` | `/api/jobs` | List the current user's jobs |
| `GET` | `/api/jobs/:id` | Fetch one owned job |
| `PUT` | `/api/jobs/:id/outputs/:type` | Save a manual output edit |
| `POST` | `/api/jobs/:id/outputs/:type/revise` | Request an AI revision |
| `GET` | `/api/jobs/:id/outputs/:type/download` | Download an owned output |
| `GET` | `/api/settings` | Read user settings |
| `PUT` | `/api/settings` | Update user settings |
| `GET` | `/api/ledger/verify/:jobId` | Verify an owned job's audit seal |
| `GET` | `/api/ledger/chain?limit=10` | Read recent ledger blocks for the user (maximum 50) |

### Generation request fields

| Field | Description |
|---|---|
| `files` | Up to five uploaded files; maximum 50 MB each |
| `sourceType` | `text`, `pdf`, `docx`, `sol`, `image`, `audio`, `video`, or `url` |
| `rawText` | Pasted source text; a bare HTTP(S) URL is treated as a URL |
| `url` | Source webpage or supported YouTube URL |
| `outputTypes` | JSON array of output keys, e.g. `["linkedin", "advisory"]` |
| `config` | JSON preferences such as `tone`, `audience`, `language`, `detailLevel`, and `targetDuration` |
| `jobId` | Existing job ID when resuming generation |
| `clarificationAnswers` | Text answering the clarification question |
| `overrideClarification` | Set to `true` to proceed with available context |

Supported configuration values include detail levels `brief`, `standard`, `detailed`; video durations `30s`, `60-90s`, `3-5 min`; and the client languages English, Hindi, Spanish, French, German, Arabic, Portuguese, and Chinese.

## Project layout

```text
MentosAI/
├── client/
│   ├── vercel.json          SPA route fallback for Vercel
│   └── src/
│       ├── components/       Workspace, previews, forms, onboarding, landing UI
│       ├── pages/            Dashboard, conversation, history, settings, auth
│       ├── hooks/             Generation state
│       └── services/          API client
└── server/
    └── src/
        ├── config/            Database and environment configuration
        ├── controllers/       Generation, jobs, settings
        ├── middlewares/       Authentication and uploads
        ├── models/            Jobs, settings, ledger blocks
        ├── pipeline/          Preprocessing, context, generation, validation, export
        ├── routes/            API route definitions
        ├── services/          Gemini, storage, cryptographic ledger
        └── utils/             Logging and token counting
```

## Security and audit notes

- Job and settings access is scoped by the authenticated Clerk user ID.
- The upload endpoint limits requests to five files, 50 MB each, and 25 generation requests per 15 minutes.
- Output downloads are served through an authenticated API endpoint.
- The audit ledger is a **private, persistent cryptographic hash chain**, not a public blockchain or cryptocurrency network.
- A completed job's block commits to the source hash, original generated-output hash, validation score, CVE references, domain, timestamp, and preceding block hash. Verification checks the chain linkage and compares stored source and original output content with those hashes.
- User edits and AI revisions are kept as later versions; they do not replace the original generated content covered by the seal.

## Known limitations

- Validation is AI-assisted and can miss errors or flag correct content; an expert should review security decisions and publication-ready material.
- Source text is retained privately with the job so source-hash verification remains possible. A production deployment should define encryption, retention, and deletion controls.
- Web extraction may fail on sites that require login, block automated requests, or return unsupported content. Pasting the relevant text is a useful fallback.
- YouTube transcript extraction depends on a transcript being available.
- Ledger verification requires the corresponding persistent ledger data. Jobs created before persistent ledger support may not be verifiable after a server restart.
- Supported file extensions do not guarantee that every file can be extracted successfully; encrypted, malformed, or image-only documents may need preprocessing or OCR support.

---

Built for Smart India Hackathon 2026 by **Team KALKI**.
