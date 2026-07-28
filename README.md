# Diagnos

**It doesn't correct your answer. It corrects your reasoning.**

An AI tutor for first-year secondary school algebra. Instead of marking a final answer
wrong, Diagnos reconstructs the student's work step by step, finds the *first* step
where the reasoning broke, names the misconception behind it, and then guides the
student with Socratic questions until they state the error themselves.

Built for the **Prometheus July AI Challenge · 2026**.

---

## Why it is different

Most tutoring apps answer *what* you got wrong. Diagnos answers *why you thought that*.

Every diagnosis is classified against a fixed, twelve-entry catalogue of documented
algebraic misconceptions (`lib/misconceptions.js`). Because those codes are stable, the
individual diagnoses aggregate into a **teacher dashboard**: a heat map of which false
ideas dominate a classroom this week. That is the part that scales from one student to
thirty-five.

The tutor never gives the answer. That constraint is enforced in the prompts and is the
whole point of the product.

---

## Features

| Route | What it does |
|---|---|
| `/analizar` | Photograph or type your work → step-by-step diagnosis → Socratic dialogue → targeted practice |
| `/tutor` | Upload a PDF → elaborated summary, key points, flashcards and exercises |
| `/docente` | Anonymous, aggregated misconception heat map for a classroom |
| `/entrar`, `/registro`, `/recuperar` | Account screens (UI only for now — see *Status*) |
| `/ayuda`, `/contacto`, `/terminos`, `/privacidad`, `/perfil` | Help centre, contact, legal and profile |

Fully bilingual (English / Spanish) with an instant in-page switcher — including the AI
output, which is generated in the selected language.

---

## Stack

- **Next.js 14** (App Router, JavaScript)
- **Tailwind CSS** — dark blue design system, see `tailwind.config.js`
- **Groq** — inference (`groq-sdk`)
- **Appwrite** — anonymous diagnosis records for the teacher dashboard
- **unpdf** — server-side PDF text extraction

### Models

Chosen per task, not one model for everything:

| Use | Model | Why |
|---|---|---|
| Diagnosis from a photo | `qwen/qwen3.6-27b` | The only Groq model with image input |
| Diagnosis from text, Socratic tutor, practice | `openai/gpt-oss-120b` | The only one with strict `json_schema` |
| PDF study material | `llama-3.3-70b-versatile` | Highest token-per-minute limit, no reasoning overhead |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Only `GROQ_API_KEY` is required. Without the Appwrite variables the app still runs —
the teacher dashboard falls back to demonstration data.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | yes | Inference |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | no | Appwrite region endpoint |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | no | Appwrite project |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | no | Database holding the diagnoses |
| `NEXT_PUBLIC_APPWRITE_TABLE_DIAGNOSTICOS` | no | Table id, defaults to `diagnosticos` |
| `APPWRITE_API_KEY` | no | Server-side writes. Scopes: `tables.read/write`, `rows.read/write` |

### Provisioning Appwrite

Appwrite has no SQL. The table, its columns, its index and its permissions are created
by API:

```bash
npm run setup:appwrite
```

The script is idempotent and seeds demonstration rows on first run.

---

## Heads-up: Groq rate limits

On the **free tier** the limit is tokens-per-minute and it varies by model:

| Model | TPM |
|---|---|
| `llama-3.3-70b-versatile` | 12 000 |
| `openai/gpt-oss-120b` / `20b`, `qwen/qwen3.6-27b` | 8 000 |
| `llama-3.1-8b-instant` | 6 000 |

This is why `/api/tutor` truncates long documents: the document text *and* a long
answer have to fit in a single request. Raising `MAX_CARACTERES` in
`app/api/tutor/route.js` is safe on a paid tier. A 429 is surfaced to the user as a
"wait a minute" message rather than a generic error.

---

## Project layout

```
app/
  api/            diagnose · socratic · exercises · tutor
  (acceso)/       sign in · sign up · password recovery
  analizar/ tutor/ docente/ ayuda/ contacto/ terminos/ privacidad/ perfil/
components/
  acceso/ tutor/  feature components
  Traza.jsx       the visual signature: the reasoning trace
  FondoAnimado.jsx + CampoParticulas.jsx   animated background
lib/
  groq.js         client, model choice, JSON recovery
  misconceptions.js  the bilingual catalogue — the heart of the product
  i18n/           dictionaries and language context
  appwrite*.js    browser and server clients
appwrite/setup.mjs  database provisioning
```

Identifiers are in Spanish, the interface ships in English and Spanish. Notation
(equations, misconception codes) is marked `translate="no"` so browser auto-translation
cannot corrupt it.

---

## Status

This is a hackathon prototype. Two things are deliberately unfinished:

- **Accounts are not connected to a database.** The sign-in, sign-up and recovery
  screens are complete UI with validation, but the session lives in `localStorage`
  (`lib/sesion.js`). Swapping in Appwrite's `account` API is the next step.
- **The contact form does not send.** It validates and confirms, but there is no mail
  backend behind it yet.

Diagnoses, the Socratic dialogue, targeted practice and the PDF study tutor are fully
functional against the live Groq API.
