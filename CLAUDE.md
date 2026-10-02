# AudioPhantom — CLAUDE.md

Desktop background assistant ("working memory for work calls"). It listens to a call, finds what is needed in the
**user's own** materials (local docs, email, chats, past calls) in real time, shows it in a quiet panel, and can
point at the screen with a cursor (Clicky-style). Windows first (Electron + TypeScript); macOS later.

**Source of truth: [docs/PLAN.md](docs/PLAN.md).** Never lose a decision from it. Do not invent features, prices or
limits: put the question in [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) and continue with a "⚠ assumption" note.
When the owner accepts a new decision, update `docs/PLAN.md` (and the affected derived docs).

## Language

- Talk to the owner (Alex) in **Russian**.
- Code, comments, file names, commits: **English**.
- UI strings: **English first**, all via i18n (`t(key)`); ru/ro later, falling back to en.

## Hard rules

1. **Secrets never enter the repo or the client app.** Local `.env` (git-ignored) for dev only; paid provider calls go
   through the server proxy (PLAN 7.6). `.env.example` lists the variables.
2. **Plans have one source of truth:** `packages/plans/src/plans.ts` (+ `features-info.ts`). Never hand-copy prices or
   limits into code or docs; `docs/TARIFFS.md` and `docs/FEATURES_INFO.md` are **generated** (`pnpm docs:gen`).
3. **Owner's hard requirement — (i) on every feature.** In every list of what a plan includes / does not include, every
   feature row has an (i) icon with the full explanation (texts: `docs/FEATURES_INFO.md`, source `features-info.ts`).
   Click/tap/keyboard-focus opens a popover (not hover-only; `aria-describedby`; Esc closes). Applies to ✘ rows too.
   In Markdown the marker is ⓘ linking to `docs/FEATURES_INFO.md#<feature_id>`. A test fails if a feature lacks `info`.
4. Log cost from day one (PLAN 7.10): STT seconds by provider, tokens in/out per task, screenshots, TTS chars, cards/hour.
5. Small English commits; tests for triggers and limits are mandatory. Re-read a phase's acceptance criteria first.
6. Audio is never stored; only text goes to the cloud. Screenshots only on demand, never stored raw (PLAN 9).

## Stack

Electron + TypeScript, Vite, React (panel); `better-sqlite3` + `sqlite-vec` + FTS5 (local index); Silero VAD;
STT: Groq Whisper (std) / Deepgram Nova-3 (premium) / local Whisper (Eco); cheap Flash-Lite-class LLM for cards,
mid-class for summaries/vision; local embeddings (Ollama); Supabase (Auth, Postgres+RLS, Edge Functions) as backend;
Paddle (Merchant of Record) for payments. Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Commands (pnpm workspace, Node >= 22)

```
pnpm install            # first time (ELECTRON_SKIP_BINARY_DOWNLOAD=1 to skip the Electron binary in CI/sandboxes)
pnpm dev                # run the desktop app
pnpm build              # build all packages
pnpm check              # lint + prettier + typecheck + tests + docs:check  (run before every commit)
pnpm test | lint | typecheck | format
pnpm docs:gen           # regenerate docs/TARIFFS.md and docs/FEATURES_INFO.md from packages/plans
```

## Structure

```
CLAUDE.md
docs/                  PLAN (truth), TARIFFS*, FEATURES_INFO*, REACTIONS, ARCHITECTURE, PRIVACY_LEGAL, ECONOMICS,
                       ROADMAP, OPEN_QUESTIONS        (* = generated)
apps/desktop/          Electron app: src/main, src/preload, src/renderer/{panel,overlay}, native/
packages/core/         providers (STT/LLM/TTS/embeddings), triggers, retriever, reaction pipeline, env loading
packages/plans/        plans.ts + features-info.ts + docs generator + tests
services/api/          Supabase Edge Functions: provider proxy, metering, limits, Paddle webhooks
supabase/migrations/   schema + RLS
eval/                  call recordings (EN/RU/RO) and eval harness
```

## Key decisions (short; full text in docs)

- **Plans (USD/mo, excl. VAT):** Solo $15 / Pro $24 / Max $45 / Ultra $79; annual = 10 months. **No free plan.**
  Trial: 3 h within 7 days, card required, Pro features. Extra pack: 15 h for $10 (not below $10: Paddle fee).
  Matrix, limits and (i) links: [docs/TARIFFS.md](docs/TARIFFS.md).
- **Reaction:** 3 levels (quiet card / whisper in pauses, headphones only / cursor with one screenshot), 3 modes
  (Quiet/Normal/Active); text always in **one fixed panel**; no tone/emotion detection; no speaker diarization on MVP;
  no Telegram/WhatsApp. [docs/REACTIONS.md](docs/REACTIONS.md).
- **Audio:** mic = "me", loopback = "them"; panel and overlay use `setContentProtection(true)`.
- **Cursor output:** structured JSON steps (normalized coords), not text tags (PLAN 7.7).
- **Retention (cloud text):** Solo 30 d / Pro 90 d / Max, Ultra 12 mo; 7-day warning email; open promises are kept.
- **Money:** Paddle (MoR), USD; Moldovan SRL, standard tax regime at start. [docs/ECONOMICS.md](docs/ECONOMICS.md).
- **Positioning:** work calls ("working memory"), not interview/exam cheating.

## Roadmap

Order P0 → P10 (cursor core first, then call listening). Current: **P0 done, next P1** (cursor core).
Phases and acceptance criteria: [docs/ROADMAP.md](docs/ROADMAP.md). Risks and open questions:
[docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md). Privacy/legal: [docs/PRIVACY_LEGAL.md](docs/PRIVACY_LEGAL.md).
