// components/editor/AIEditModal.tsx
'use client';

import { useState } from 'react';
import { useDeckStore } from '@/lib/store';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export function AIEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { deck, activeIndex, updateContent } = useDeckStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !deck) return null;
  const slide = deck.slides[activeIndex];
  if (!slide) return null;

  const submit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slide,
          deckTitle: deck.title,
          instruction: prompt,
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      updateContent(activeIndex, data.content);
      onClose();
      setPrompt('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'Make this punchier',
    'Make it more formal',
    'Shorten everything by half',
    'Rewrite in Wistia voice',
  ];

  return (
    <div className="fixed inset-0 bg-grey-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-grey-800 border border-grey-700 rounded-xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-grey-700">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-green-400" />
            <h3 className="text-grey-100 font-display font-semibold">AI Edit</h3>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-grey-300 text-sm">
            Describe how you want to change this <strong className="text-grey-100">{slide.layout}</strong> slide.
            The AI will rewrite the text while keeping the layout the same.
          </p>

          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-xs px-2.5 py-1 rounded-full border border-grey-600 text-grey-300 hover:border-green-400 hover:text-green-400 transition"
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
            }}
            placeholder="e.g. Rewrite for a CFO audience, focus on ROI"
            rows={4}
            className="w-full bg-grey-900 border border-grey-700 rounded px-3 py-2 text-sm text-grey-100 placeholder:text-grey-500 resize-none focus:border-green-400 focus:outline-none"
          />

          {error && <div className="text-pink-400 text-sm">{error}</div>}

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-grey-300 hover:text-grey-100 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading || !prompt.trim()}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition',
                loading || !prompt.trim()
                  ? 'bg-grey-700 text-grey-500 cursor-not-allowed'
                  : 'bg-green-400 hover:bg-green-300 text-grey-900'
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Apply
                </>
              )}
            </button>
          </div>
          <div className="text-grey-500 text-xs">⌘+Enter to submit</div>
        </div>
      </div>
    </div>
  );
}
