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
| `CODIGO_DOCENTE` | no | Secret required to switch a user's role to teacher (`/api/rol`). Without it, no one can become a teacher |

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
`app/api/tutor/route.js` is safe on a paid tier. Every route that calls Groq
(`diagnose`, `exercises`, `socratic`, `verificar`, `tutor`) surfaces a 429 as a "wait
a minute" message instead of a generic error, and `clienteGroq()` disables the SDK's
own automatic retries: on the free tier a retried 429 always hits the same per-minute
window, so retrying only delays the error — and on Vercel, where the function itself
is killed at `maxDuration` (60s), that delay could eat the whole budget before the
route ever gets to return its own message.

A quick local check makes the ceiling concrete: 35 concurrent `/api/diagnose` calls
(one classroom submitting at once) against the free tier land as roughly 2-6
successes and the rest clean 429s, not failures — this is a capacity limit of the
free tier, not a bug, and it is why the teacher dashboard and practice loop are
built to tolerate an occasional "try again in a minute" rather than assuming every
call succeeds.

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

This is a hackathon prototype.

Working against live backends: diagnosis (typed and from a photo), the Socratic
dialogue, targeted practice, the PDF study tutor, the teacher dashboard, and
**accounts** — sign-up, sign-in, roles, password recovery by email and sign-out, all
on Appwrite Auth (`lib/cuenta.js`, `lib/sesion.jsx`). Guest mode stays local so the
project does not accumulate an anonymous user per visit.

The practice loop closes: the student solves the targeted exercises, and
`/api/verificar` judges two things separately — whether the answer is right, and
whether they committed *that specific misconception* again. Those are independent on
purpose. A right answer with the misconception visible in the steps does not count;
a wrong answer from an arithmetic slip, with the targeted reasoning applied correctly,
does. Only the second question decides whether the misconception is overcome.

The teacher dashboard is scoped to a classroom and reads server-side. The browser
cannot query the diagnoses table at all — the table has no client permissions.
`/api/aula` identifies the caller from an Appwrite JWT, reads the classroom code from
their own preferences, and queries with the server API key. A student cannot request
another classroom's data because the classroom is never a client-supplied parameter.

The contact form stores messages in a separate Appwrite table that has no client
permissions, so the inbox is readable only from the Appwrite console. There is no
mail delivery yet: the message is kept, not forwarded. A hidden honeypot field and
length caps keep the endpoint from being an open spam target.

Becoming a teacher is not self-service: `updatePrefs()` lets any signed-in user write
to their own preferences, so writing `rol: "docente"` straight from the client would
let a student open the teacher dashboard with one click. Instead `/api/rol` verifies
a `CODIGO_DOCENTE` server secret before writing the role, using the caller's own JWT
to prove who they are — the same "server decides, client never self-declares"
pattern used for the classroom code everywhere else in the app.

### Required setup step

Appwrite rejects browser requests from unregistered origins. Every domain that serves
the app — `localhost` is allowed by default, your production domain is not — must be
added in the Appwrite console under **Overview → Platforms → Add platform → Web**.
Without it the teacher dashboard silently falls back to demonstration data and every
account screen fails with `general_unknown_origin`.
