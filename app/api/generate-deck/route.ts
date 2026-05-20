// app/api/generate-deck/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import type { Slide, Deck } from '@/lib/types';
import type { ThemeName } from '@/lib/themes';

export const runtime = 'nodejs';

const SYSTEM = `You are a presentation designer who creates on-brand slide decks for Wistia — a video hosting and marketing platform.

Wistia's voice: humble, wholesome, inclusive, positive, playful (when appropriate). Chicago Manual of Style, Oxford comma. No exaggeration. Clear, simple language. No swear words. Frame things positively. Em dashes (—) without spaces.

You will receive a brief. Return a JSON object for a 6-slide deck. The deck should tell a clear story arc: hook → problem → solution → proof → impact → call to action.

Return ONLY valid JSON, no prose, no markdown fences. Use this exact shape:

{
  "title": "Deck title",
  "theme": "blue",
  "slides": [
    {
      "layout": "cover",
      "themeOverride": null,
      "showLogo": true,
      "notes": "",
      "content": {
        "eyebrow": "WISTIA",
        "title": "...",
        "subtitle": "..."
      }
    }
  ]
}

Layouts available: "cover", "section", "two-col", "big-quote", "hero", "stats"
Themes available: "blue", "green", "pink", "yellow", "purple", "white"

Content fields per layout:
- cover: eyebrow, title, subtitle
- section: sectionNumber ("01", "02" etc), eyebrow, title, body
- two-col: eyebrow, title, columns (array of 3 × {heading, body})
- big-quote: quote, attribution
- hero: eyebrow, title, subtitle
- stats: eyebrow, title, stats (array of 3 × {value, label})

Rules:
- Slide 1 must be layout "cover"
- Use themeOverride to give 1–2 slides a different theme for visual variety (null for the rest)
- Keep titles short and punchy (under 10 words)
- Keep body copy under 40 words
- Stats must have real-looking numbers (percentages, multipliers, round figures)
- Return exactly 6 slides`;

type RawSlide = Omit<Slide, 'id'>;
type RawDeck = { title: string; theme: ThemeName; slides: RawSlide[] };

export async function POST(req: Request) {
  try {
    const { brief } = (await req.json()) as { brief: string };

    if (!brief?.trim()) {
      return NextResponse.json({ error: 'brief is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set on the server.' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Create a 6-slide Wistia deck based on this brief:\n\n${brief.trim()}`,
        },
      ],
    });

    const text = resp.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();

    let raw: RawDeck;
    try {
      raw = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'AI response was not valid JSON.', raw: text }, { status: 502 });
    }

    const now = Date.now();
    const deck: Deck = {
      id: nanoid(10),
      title: raw.title || 'Generated deck',
      theme: raw.theme || 'blue',
      createdAt: now,
      updatedAt: now,
      slides: (raw.slides || []).map((s) => ({ ...s, id: nanoid(8) })),
    };

    return NextResponse.json({ deck });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
