<div align="center">

# Diagnos

### *It doesn't correct your answer. It corrects your reasoning.*

An AI tutor that diagnoses **why** a student got an algebra problem wrong — not just that they did — by classifying the error against misconceptions documented in mathematics education research, guiding the student with Socratic questions until they name the mistake themselves, and aggregating those diagnoses into a classroom heat map so the teacher knows what to reteach on Monday.

**[→ Live application](https://diagnos-hazel.vercel.app)** &nbsp;·&nbsp; Guest mode enabled — no account required

Built for the **Prometheus July AI Challenge · 2026**

`Next.js 14` · `Appwrite` · `Groq` · `Vercel` · `EN / ES`

</div>

---

## Table of contents

- [The problem](#the-problem)
- [How it works](#how-it-works)
- [The design decision that defines this project](#the-design-decision-that-defines-this-project)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Model selection](#model-selection)
- [Getting started](#getting-started)
- [Testing and CI](#testing-and-ci)
- [Security and privacy](#security-and-privacy)
- [The misconception catalogue](#the-misconception-catalogue)
- [Honest limitations](#honest-limitations)
- [Roadmap](#roadmap)

---

## The problem

Every math application responds to a wrong answer the same way: **"Incorrect. The answer was 5."**

That sentence closes a loop that should have opened one. The student now knows a number they didn't know before, and knows nothing about the thought that led them somewhere else.

Behind a repeated algebra mistake there is almost never a typo. There is a **misconception**: a false rule the student genuinely believes is true, applies consistently, and has no reason to doubt. A student who writes `3x + 5 = 20` and then `3x = 20 + 5` is not being careless — they are being *systematic*. They believe a term keeps its sign when it crosses the equals sign, and they will keep believing it in every exercise and every exam for the rest of the year, until somebody names that belief out loud.

Naming it is the entire job. It is also precisely the job nobody has time to do: a teacher with thirty-five notebooks and forty-five minutes cannot reconstruct the reasoning behind each wrong answer one student at a time.

Diagnos is not an answer checker with better wording. It is a **reasoning diagnostician**, designed from the first line of code to scale from one student to a full classroom.

---

## How it works

The core loop lives at `/analizar`. The constraint that shaped all of it: **the application must never hand over the answer.**

### 1 · Show your work — on paper, if that's what you have

The student photographs their notebook or types their steps. A vision model reads the handwriting and reconstructs the procedure exactly as written, preserving the student's own notation rather than normalizing it.

This was an accessibility decision, not a technical flourish. Requiring students to retype work into a structured editor would exclude exactly the classrooms that need this most — the ones where the available tools are a notebook, a pencil, and a shared phone.

### 2 · Locate the step where the reasoning broke

The final answer is ignored entirely. Diagnos walks the reasoning chain and identifies the **first** step where the logic fails. Every step after it is marked as *carried forward*, not as a new error — because it isn't one.

A student who makes one sign error and then executes four flawless steps on a now-incorrect equation has demonstrated four steps of correct algebra. Marking those as "wrong" is not merely unhelpful; it is false, and it teaches the student that their reasoning is unreliable when the truth is that one specific belief is.

### 3 · Name the misconception

The error is classified against a **fixed catalogue of twelve documented algebraic misconceptions**, each grounded in published research. The catalogue is closed and its codes are stable, which makes classification reproducible, auditable and — critically — **aggregable**.

It also means the labels aren't invented by a language model on the spot: they are categories the literature already established.

### 4 · Socratic dialogue — questions only, never the answer

The tutor is hard-constrained at the prompt level: it may only ask questions. No rules, no corrected step, no solution, regardless of how directly the student asks.

It continues until **the student** states their own error out loud, at which point the model emits a sentinel the application listens for — so the system can distinguish genuine insight from a lucky guess before advancing.

The pedagogy is not decoration. A misconception that is *told* to a student competes with a belief they already hold, and usually loses. A misconception the student articulates themselves replaces it.

### 5 · Targeted practice — three exercises against *your* error

Diagnos generates three new exercises aimed at that specific misconception, escalating in difficulty. The third is constructed so the false rule produces a visibly absurd result — so the exercise itself refutes the belief without anyone having to assert anything.

### 6 · The classroom heat map

Because the catalogue codes are stable, individual diagnoses aggregate. At `/docente`, a teacher sees which false ideas dominate their classroom this week, ranked, with a second layer showing how much has already been overcome.

This is the piece that scales the product from *helping a student* to *helping a class of thirty-five* — which is the problem a mathematics teacher actually has every day.

---

## The design decision that defines this project

> ### Correct is not the same as overcome.

Targeted practice is graded on **two independent axes**, deliberately kept apart:

| | Answer correct | Answer incorrect |
|---|---|---|
| **Misconception repeated** | ❌ Not overcome | ❌ Not overcome |
| **Misconception absent** | ✅ Overcome | ✅ Overcome *(arithmetic slip)* |

A correct answer with the flawed reasoning still visible does **not** count as overcome. An arithmetic slip with correct algebraic reasoning **does**.

Collapsing those two questions into a single right/wrong score is the mistake every other tool in this category makes. Keeping them separate forces the model to reason about student *intent* rather than about a number.

---

## Features

| Route | What it does |
|---|---|
| `/analizar` | Photograph or type your procedure → step-by-step diagnosis → Socratic dialogue → targeted practice |
| `/tutor` | Upload a PDF → elaborated summary, key points, flashcards and exercises |
| `/docente` | Anonymous, aggregated classroom heat map of misconceptions, with an overcome layer |
| `/grafica` | Function laboratory — trigonometric, rational and other functions, with correct asymptote detection |
| `/ayuda` | The complete misconception catalogue with academic references |
| `/entrar` `/registro` `/recuperar` | Sign-up, sign-in and email password recovery |
| `/perfil` | Personalization, streak, points, classroom code, server-verified role change |
| `/contacto` `/terminos` `/privacidad` | Contact, legal and privacy policy |

**Also included:**

- **Guest mode** — the core loop runs without an account
- **Gamification with a purpose** — consecutive-day streaks with milestones, accumulated points, achievement stickers, designed to bring a student back tomorrow
- **Genuinely bilingual (EN / ES)** — including AI-generated output, not merely interface strings

---

## Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router, JavaScript) · Tailwind CSS with a custom dark design system · hand-rolled i18n on React context with synchronized EN/ES dictionaries |
| **Backend** | Appwrite — Auth and TablesDB (diagnoses, overcome records, messages) |
| **PDF processing** | `unpdf` — server-side text extraction |
| **Inference** | Groq — model selection per task |
| **Deployment** | Vercel |
| **Quality** | 42 tests on Node's native runner · GitHub Actions CI |

We wrote our own internationalization layer rather than pulling in a library, because the hard part was never the interface strings — it was keeping *model-generated* content consistently in the student's language, which no i18n package solves for you.

---

## Model selection

Each task carries different constraints, so each task received a different model. This was a reasoned allocation, not a default:

| Task | Model | Why this one |
|---|---|---|
| Diagnosis from a photograph | `qwen/qwen3.6-27b` | The only Groq model with image input |
| Diagnosis, Socratic dialogue, practice | `openai/gpt-oss-120b` | The only one with strict `json_schema` — non-negotiable when the UI renders structured steps |
| PDF tutor | `llama-3.3-70b-versatile` | Highest tokens-per-minute ceiling, no reasoning overhead on a task that doesn't need it |

**The engineering that mattered was in the prompts.** The infrastructure is conventional; the difficulty lay elsewhere. Getting a model to reliably *withhold* an answer, to distinguish a carried-forward consequence from a fresh error, and to judge reasoning independently of results required iteration with explicit positive and negative examples embedded in each system prompt — this is what a good response looks like, and this is what a forbidden one looks like.

---

## Getting started

### Prerequisites

- Node.js 18 or later
- An [Appwrite](https://appwrite.io) project (Auth + TablesDB)
- A [Groq](https://console.groq.com) API key

### Installation

```bash
git clone https://github.com/neterfk-coder/Diagnos-proyect.edu.git
cd Diagnos-proyect.edu
npm install
```

### Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```env
# Groq inference
GROQ_API_KEY=gsk_...

# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=...
APPWRITE_DATABASE_ID=...

# Teacher role promotion — server-verified secret
CODIGO_DOCENTE=...
```

> Variable names above follow the repository's `.env.example`. Check that file for the authoritative list.

### Run locally

```bash
npm run dev      # development server at http://localhost:3000
npm test         # run the test suite
npm run build    # production build
```

---

## Testing and CI

**42 automated tests** run on Node's native test runner — deliberately with zero new dependencies — covering:

- PDF chunking
- Streak logic
- Misconception catalogue integrity
- Asymptote detection in the function laboratory

**GitHub Actions** executes the full suite *and* a production build on every push, so a change that passes tests but breaks the build never reaches `main` unnoticed.

The catalogue-integrity tests deserve specific mention: because every diagnosis, every generated exercise and the entire teacher heat map key off those codes, a single typo in the catalogue would silently corrupt aggregate classroom data. Testing it is inexpensive; discovering it in production would not have been.

---

## Security and privacy

We treated this as a product that would handle minors' schoolwork, because that is what it is.

**Anonymity is structural, not promised.** Diagnoses are stored with **no user identifier whatsoever** — only a misconception code and a classroom code. The heat map works precisely because it never needed to know who made the mistake. There is no "we don't look at it" policy to trust here: the association doesn't exist in the database.

**Zero client permissions on data tables.** Every sensitive read and write passes through a server route that verifies identity by JWT, never by what the client claims to be. A student's classroom is derived from the verified token, so nobody can retrieve another class's data by editing a request parameter.

**The teacher role is not self-service.** Promotion requires a code the *server* verifies against a secret, using the user's JWT to prove identity. This closed a real hole present in an earlier version, where any student could promote themselves with a single click — we found it and fixed it properly, and that fix cascaded into removing client permissions from data tables entirely.

**Spam hardening.** The contact form carries a hidden honeypot field and length limits against automated submissions.

---

## The misconception catalogue

Twelve documented algebraic misconceptions, each grounded in published research in mathematics education. The full catalogue with its citations is published **inside the application** at `/ayuda` — not buried in source code.

**Primary sources:**

- Kieran, C. (1981) — *Concepts associated with the equality symbol*
- Küchemann, D. (1981) — *Algebra*, in Hart (ed.), Children's Understanding of Mathematics
- Matz, M. (1982) — *Towards a process model for high school algebra errors*
- Fischbein, E., Deri, M., Nello, M. S. & Marino, M. S. (1985) — *The role of implicit models in solving verbal problems in multiplication and division*
- De Bock, D., Van Dooren, W., Janssens, D. & Verschaffel, L. (2002) — *Improper use of linear reasoning*
- Vlassis, J. (2004) — *Making sense of the minus sign*
- Ni, Y. & Zhou, Y. (2005) — *Teaching and learning fraction and rational numbers: the origins and implications of whole number bias*

---

## Honest limitations

We would rather state these plainly than have them discovered.

> **This is prompt engineering on hosted models**, not a fine-tuned or self-trained model. If fine-tuning is the bar, there is nothing here to show. If the intelligent application of existing models to the right problem is, the project defends itself.

> **This is a functional prototype, not an efficacy study.** The design is built for learning impact, but we do not yet have data from a real classroom using it over weeks. We are claiming a well-designed intervention, not a proven one.

> **Free-tier inference limits mean it is not yet ready for 35 concurrent students.** A local load test simulating a full class confirmed most clients receive a 429. We know this because we measured it rather than assumed it. All four AI endpoints now return a clear "wait a minute" message instead of a generic failure, and SDK automatic retries are disabled so the error surfaces in seconds rather than after a minute — which matters, because Vercel functions terminate at 60 seconds.

---

## Roadmap

**Widen the catalogue** — extend beyond first-year algebra into geometry and physics, holding the same standard: every misconception cited, never invented.

**Run a real pilot** — place Diagnos in an actual classroom for a full term and measure the only metric that matters: whether misconception *recurrence* declines. That is the study this prototype was designed to make possible.

**Ship offline capture** — let students in low-connectivity schools photograph their work now and synchronize when they have signal. This is the reason we designed around paper, pencil and a camera in the first place, and it is the difference between a tool for well-resourced classrooms and a tool for the ones that need it most.

---

## What we learned

The hard part of an educational AI product is not the model. It is deciding **what the model is not allowed to do.**

Every meaningful design decision in Diagnos was a subtraction. Don't grade the final answer. Don't reveal the rule. Don't accept a correct number as proof of understanding. Don't mark carried-forward steps as new errors. Don't store who made the mistake. The product improved every time we removed a capability that felt helpful and was in fact corrosive to learning.

We also learned something from the research that reshaped an entire feature: **misconceptions do not disappear when you state the correct rule.** They are replaced when a student watches their own rule produce something absurd. That single finding is why the third generated exercise always drives the false belief to a visibly ridiculous conclusion — the exercise argues, so the tutor doesn't have to.

---

<div align="center">

**[Try Diagnos →](https://diagnos-hazel.vercel.app)**

*The best moment to learn is right after you get it wrong.*

</div>
