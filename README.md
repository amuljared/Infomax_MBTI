# GA Quick Personality Test

A 12-question MBTI quick test (E/I, S/N, T/F, J/P) built with **Next.js 14 (App Router) + Tailwind**, with instant on-page scoring and live persistence to **Google Sheets**. Deployable to **Vercel** in a few clicks.

## What it does

- Presents 12 questions grouped into 4 themes — *How you interact* / *How you take in information* / *How you make decisions* / *How you approach life* — sourced from `MBTI Personality Test.docx`.
- Computes the 4-letter type instantly on submit (client-side, no API round-trip).
- Shows a rich result: type code, nickname, description, per-dimension breakdown, and letter meanings.
- Saves each response (name + group color + result + answers + tallies) to a **Google Sheet**, live.
- Results are deep-linkable via URL hash (`/#INFJ`) and can be copied to the clipboard.

## Project structure

```
src/
  lib/
    types.ts        # 16 MBTI types, letter meanings, dimension metadata
    questions.ts    # the 12 questions
    score.ts        # scoring logic (tally → 4-letter type)
    sheets.ts       # Google Sheets persistence (saveResponse())
  components/
    MbtiApp.tsx     # form + result UI (single client component)
  app/
    layout.tsx
    page.tsx
    globals.css
scripts/
  apps-script.js    # Google Apps Script (paste into the sheet's Apps Script editor)
```

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in your Google Sheets web-app URL (or skip — form works without it)
npm run dev
```

Open http://localhost:3000. The form works fully even **without** the sheet configured — it just won't persist responses.

## Google Sheets setup (one time)

1. Create a Google Sheet.
2. **Extensions → Apps Script**, paste the contents of [`scripts/apps-script.js`](scripts/apps-script.js), then **Deploy → New deployment → Web app** (Execute as: **Me**, Who has access: **Anyone**).
3. Copy the **Web app URL** (ends in `/exec`).
4. Set it as `NEXT_PUBLIC_GOOGLE_SHEETS_URL` in `.env.local` (local) or Vercel env vars (production).

Each submission appends one row: `Timestamp · Name · Group Color · Result · Nickname · Description · Answers · Tallies`.

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Next.js. Set the environment variable:
   - `NEXT_PUBLIC_GOOGLE_SHEETS_URL`
4. **Deploy.**

(Or from the CLI: `npx vercel` after logging in with `npx vercel login`.)

## Notes & caveats

- **Question count**: the source doc labels each dimension "1–4 / 5–8 / 9–12 / 13–16" but only lists questions 1–3, 5–7, 9–11, 13–15 (Q4, 8, 12, 16 are missing). This build ships the **12 questions that exist** — 3 per dimension, so there's never a tie — and renumbers them to clean **1–12** ids in `src/lib/questions.ts` for tidy results data. To move to 4 per dimension, add the missing questions (scoring handles any count; ties default to the first letter).
- **`npm audit` advisories**: the installed Next.js 14.2.35 is the latest 14.x. The reported advisories are all config-dependent and **not applicable to this app** (no `next/image`, no Server Actions, no middleware/rewrites/i18n, no custom server, and it's hosted on Vercel/Linux, not a self-hosted Windows box). If you want to clear them entirely you'd need a major bump to Next 16, which is a breaking change and unnecessary here.
- This is a lightweight quick test for team-building / icebreakers — not a clinical or validated psychometric instrument.
