# Wistia SlideGen

An on-brand slide generator for Wistia decks. Inspired by AirOps' Greenhouse OS.

## What it does

- 6 brand-correct layouts: Cover, Section, Two-col, Big quote, Hero, Stats
- 6 "paper" themes drawn from Wistia's color palette: Blue, Green, Pink, Yellow, Purple, White
- Per-slide theme overrides (deck stays Blue, this one slide goes Pink)
- Inline editing — click any text on the canvas to edit it
- AI Edit (Claude Sonnet 4.5) — rewrite a slide with a one-line instruction
- Present mode — fullscreen with arrow-key navigation
- PDF export — every slide rendered to a 1600x900 page
- Shareable link — your entire deck encoded into a URL hash, no backend needed
- Local persistence — drafts saved to localStorage automatically

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS with Wistia brand tokens
- Zustand for deck state
- Anthropic SDK for AI Edit
- jsPDF + html-to-image for export
- Framer Motion for present-mode transitions

## Setup

```bash
# 1. Install
npm install

# 2. Add your Anthropic API key (only needed for AI Edit)
cp .env.example .env.local
# edit .env.local

# 3. Run
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

```bash
npx vercel
```

Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard.

## Architecture notes

### The data model
Every slide carries every possible content field (title, subtitle, body, quote,
columns, stats, etc.). Each layout component pulls the subset it cares about.
This is what makes "Remix Layout" work — switching from Cover to Two-col
doesn't destroy your title, it just reflows.

### The 1600x900 stage
Every slide is rendered into a fixed 1600x900 virtual canvas, then CSS-scaled
to fit any container. Same trick Keynote and Google Slides use — typography
stays pixel-perfect at any zoom level.

### Shareable links
The full deck JSON is LZ-compressed and stuffed into a URL hash. Open
`/deck/shared#<compressed>` and the deck loads from the URL with no server
round-trip. Good enough for v1; swap to Postgres + auth when you outgrow it.

### Brand source
All colors, typography rules, and voice guidelines come from
https://wistia.github.io/brand/. Tokens live in `lib/tokens.ts` — update
that one file to ripple changes through everything.

## What's next

- Real multi-user collaboration (Postgres + Liveblocks or Y.js)
- AirOps' "MACHINE mode" — full-deck generation from a brief
- Giphy integration for the hero layout
- More layouts: timeline, comparison table, cover-with-image
- Real GT Walsheim font (when you have a license)
