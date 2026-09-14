# MentosAI

**Gen AI Platform for Automated Content Transformation**
Smart India Hackathon 2026 — Problem Statement SIH26154 (National Technical Research Organisation)

MentosAI converts a single piece of source content (a document, article, report, image, or prompt) into multiple ready-to-use deliverables — LinkedIn posts, Twitter/X threads, advisories, executive summaries, presentations, infographics, and video packages — through one configurable dashboard.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Current Implementation Status](#current-implementation-status)

---

## Problem Statement

Organizations frequently need to convert source information (news articles, reports, advisories, threat intelligence, research papers, incident reports) into specific communication formats. Doing this manually is slow, inconsistent, and requires domain + communication expertise for every format.

MentosAI provides a single dashboard where an operator uploads content once, selects the desired output format(s), and receives all deliverables generated in parallel from the same source — with configurable tone, audience, language, and detail level.

## Features

- **Multi-format input** — plain text, PDF, DOCX, images, and (planned) audio/video
- **Multi-format output** — LinkedIn Post, X/Twitter Thread, Advisory, Executive Summary, Presentation, Infographic, Video Package
- **Configurable generation** — tone, audience, language, detail level, objective
- **Parallel generation** — all selected output types are generated concurrently from one shared context
- **Built-in validation** — every generated output is automatically checked against the source for hallucinations and factual consistency
- **Large-document handling** — documents beyond a token threshold are chunked and map-reduce summarized before context extraction, keeping cost and latency predictable regardless of document size

## Architecture

```
Dashboard (React)
   → upload content + select output types + set tone/audience/language/detail
        ↓
Backend API (Express)
        ↓
Preprocessing
   → PDF/DOCX → text (pdf-parse, mammoth)
   → Image → description (Gemini vision)
   → Large text (beyond threshold) → chunked + map-reduce summarized
        ↓
Context Extraction (1 LLM call)
   → summary + intent + key points + entities + domain + tone
        ↓
Orchestrator
   → runs generators for all selected output types in parallel (Promise.all)
        ↓
Generators (one function per format, own prompt template)
   → LinkedIn, Twitter, Advisory, Executive Summary, Presentation, Infographic, Video Package
        ↓
Validator
   → checks each output against the source context for hallucinations / factual consistency
        ↓
Formatter / Export
   → writes the deliverable to disk (plain text now; PPTX/PDF formatters planned)
        ↓
Dashboard → displays results with download links
```

See `docs/architecture.md` for the full architecture document.

## Tech Stack

**Frontend**
React 19, Vite, Tailwind CSS, Axios, react-dropzone, lucide-react, Clerk (auth)

**Backend**
Node.js, Express 5, MongoDB / Mongoose, Multer, Google Gemini API (`@google/genai`), pdf-parse, mammoth, pptxgenjs, puppeteer, Clerk (`@clerk/express`)

## Project Structure

```
MentosAI/
├── client/            React frontend (Vite)
└── server/            Express backend
    └── src/
        ├── config/            DB + env setup
        ├── routes/            API routes
        ├── controllers/       Request handlers
        ├── middlewares/       Auth, upload, error handling
        ├── pipeline/
        │   ├── preprocessing/     File/text → clean text
        │   ├── contextExtraction/ LLM-based summary & intent extraction
        │   ├── orchestrator/      Parallel generator dispatch
        │   ├── generators/        One module per output format
        │   ├── validator/         Hallucination / consistency check
        │   └── formatter/         Export to PPTX / PDF / text
        ├── models/            Mongoose schemas
        └── services/          LLM client wrapper, storage
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- A MongoDB connection string (MongoDB Atlas free tier works)
- A Gemini API key ([aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
- A Clerk account for authentication ([clerk.com](https://clerk.com))

### 1. Clone the repository
```bash
git clone <repository-url>
cd MentosAI
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # fill in the values, see below
npm run dev
```
Server starts on `http://localhost:5000`. Verify with `GET /health`.

### 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env   # fill in the values, see below
npm run dev
```
Frontend starts on `http://localhost:5173`.

## Environment Variables

**`server/.env`**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## API Reference

### `POST /api/generate`
Multipart form-data request.

| Field | Type | Description |
|---|---|---|
| `file` | File | Source file (PDF, DOCX, image) — optional if `rawText` is provided |
| `sourceType` | string | One of `text`, `pdf`, `docx`, `image`, `audio`, `video`, `url` |
| `rawText` | string | Source text — used when `sourceType` is `text` |
| `outputTypes` | JSON string | Array of desired outputs, e.g. `["linkedin","advisory"]` |
| `config` | JSON string | `{ "tone": "professional", "audience": "...", "language": "en", "detailLevel": "standard" }` |

Returns the completed job document, including generated content, validation results, and download filenames for each requested output type.

### `GET /api/download/:filename`
Downloads a generated output file.

## Current Implementation Status

| Component | Status |
|---|---|
| Preprocessing (PDF, DOCX, image, chunking) | ✅ Implemented |
| Context extraction | ✅ Implemented |
| Orchestrator (parallel execution) | ✅ Implemented |
| Generators — LinkedIn, Twitter, Advisory, Exec Summary, Presentation, Infographic, Video Package | ✅ Implemented |
| Validator | ✅ Implemented |
| Formatter — plain text export | ✅ Implemented |
| Formatter — PPTX / PDF export | 🔲 Planned |
| Audio/video transcription | 🔲 Planned |
| Authentication (Clerk) | ✅ Implemented (middleware wired, integration in progress) |
| Frontend dashboard | ✅ Implemented |

---

Built for Smart India Hackathon 2026 by Team KALKI.