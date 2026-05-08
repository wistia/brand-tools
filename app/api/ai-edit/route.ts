// app/api/ai-edit/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import type { Slide } from '@/lib/types';

export const runtime = 'nodejs';

const SYSTEM = `You are a copywriter rewriting a single slide of a Wistia presentation deck.

Wistia's voice is: humble, wholesome, inclusive, positive, playful (when appropriate). You follow the Chicago Manual of Style and use the Oxford comma. You don't exaggerate. You write in clear, simple language. You avoid swear words and cultural references. You frame things positively. You use em dashes (—) without spaces.

You will receive a slide as JSON. Rewrite the text fields based on the user's instruction. Return ONLY a JSON object containing the fields that should change. Do not include fields that aren't being changed. Do not change the layout. Keep titles short and punchy. Keep body copy under 50 words unless the layout demands more.

The slide content fields you can update are:
- eyebrow (short uppercase label)
- title (main headline — keep short and impactful)
- subtitle (supporting line under title)
- body (paragraph copy)
- quote (for big-quote layouts)
- attribution (who said the quote)
- sectionNumber (for section layouts, like "01" or "02")
- columns (array of {heading, body} for two-col layouts)
- stats (array of {value, label} for stats layouts)

Return JSON only, no prose, no markdown fences. Example:
{"title": "New title", "body": "New body copy."}`;

export async function POST(req: Request) {
  try {
    const { slide, deckTitle, instruction } = (await req.json()) as {
      slide: Slide;
      deckTitle: string;
      instruction: string;
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set on the server.' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userMsg = `Deck title: ${deckTitle}
Slide layout: ${slide.layout}
Current content: ${JSON.stringify(slide.content, null, 2)}

Instruction: ${instruction}

Return only the JSON object with updated fields.`;

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });

    const text = resp.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    // Strip any code fences if the model added them despite instructions
    const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();

    let parsed: Partial<Slide['content']>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'AI response was not valid JSON.', raw: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: parsed });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
