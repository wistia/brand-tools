# Wistia Carousel Builder

Self-serve social carousel builder for Wistia's social channels. Quote block,
rich text, and cover slide templates with multi-asset PNG export.

## For the social team

See [docs/USING-THE-BUILDER.md](./docs/USING-THE-BUILDER.md) for a non-engineer
usage guide.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add the brand font

GT Walsheim isn't bundled (licensing). Drop the font files in
`public/fonts/walsheim/` — see the README in that folder. Until you do, the
builder falls back to system-ui.

## Milestones

- [x] **M1 — Foundation.** Next.js + TS scaffold, Tailwind, Wistia brand
      tokens, elevation shadows, font loading, route shells.
- [x] **M2 — Core editor shell.** Canvas at 1:1 and 4:5, slide rail
      (add/remove/reorder, max 10), template picker, format + color
      scheme controls.
- [x] **M3 — Quote block template.** Two variants (Light, Bold), accent
      stripe, decorative quote marks, auto-sizing for long quotes.
- [x] **M4 — Rich text template.** Two variants (Stacked, Split),
      eyebrow + headline + body, accent details.
- [x] **M5 — Multi-asset export.** Renders each slide at native resolution
      (1080×1080 or 1080×1350) into an off-screen container, rasterizes to
      PNG via html-to-image, bundles into a zip with timestamped filename
      and per-slide names (`wistia-carousel-01.png` → `-10.png`). Progress
      bar in the export button.
- [x] **M6 — Cover slide template.** Two variants (Minimal, Showcase),
      configurable Wistia logo, up to 3 images, optional subtext, decorative
      accent flourishes.
- [x] **M7 — Polish + handoff.** Voice/tone hints in placeholders,
      keyboard shortcuts (← →), social team usage doc, friendly error
      states.

## Architecture

```
src/
├── app/
│   ├── builder/page.tsx     # The editor
│   ├── page.tsx             # Landing
│   ├── layout.tsx           # Inter font from Google
│   └── globals.css          # GT Walsheim @font-face
├── components/
│   ├── Canvas.tsx           # Scales native-resolution slides to fit viewport
│   ├── GlobalControls.tsx   # Format + color scheme
│   ├── SlideControls.tsx    # Per-slide content fields
│   ├── SlideRail.tsx        # Thumbnail strip + add/reorder/delete
│   ├── SlideView.tsx        # Dispatches to template by slide type
│   ├── TemplatePicker.tsx   # Cover / Quote / Rich text switch
│   ├── WistiaLogo.tsx       # Inline SVG wordmark + flags
│   └── templates/
│       ├── CoverTemplate.tsx
│       ├── QuoteTemplate.tsx
│       └── RichTextTemplate.tsx
└── lib/
    ├── types.ts             # SOURCE OF TRUTH: all data shapes, color palette,
    │                        # auto-sizing helpers
    ├── useCarousel.ts       # Editor state hook (slides, format, scheme)
    ├── useExport.tsx        # Export hook: React tree → off-screen → zip
    ├── export.ts            # Pure export pipeline (rasterize + zip + save)
    └── useKeyboardShortcuts.ts
```

### Key design decisions

**Slides render at native pixel dimensions.** A 1:1 slide is laid out at
1080×1080 in the DOM, then visually scaled by `transform: scale(...)` in
the Canvas wrapper. This means a 72pt headline IS 72pt — and the export
pipeline rasterizes the same DOM at native resolution for pixel-perfect
PNGs.

**Single source of truth in `types.ts`.** All slide shapes, the color
palette (mirrored from Tailwind so both layers see the same hexes),
auto-sizing heuristics, and the `MAX_SLIDES` constant live there. Add a
new slide type? Start there.

**Off-screen render for export.** Rasterizing the visible Canvas would
give us a downscaled PNG (because the Canvas is scaled to fit the
viewport). Instead, `useExport` uses `React.createRoot` to mount each
slide into a hidden 1080-wide container, rasterize that, then move on.

## Tech

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind 3.4
- html-to-image, jszip, file-saver for export
