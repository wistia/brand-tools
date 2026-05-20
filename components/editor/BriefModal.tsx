// components/editor/BriefModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeckStore } from '@/lib/store';
import { X, Sparkles, Loader2 } from 'lucide-react';
import type { Deck } from '@/lib/types';

const PLACEHOLDER = `Example: "A 6-slide pitch for Wistia's video analytics product. Audience is marketing directors at mid-size SaaS companies. Key points: engagement data, lead gen from video, easy integration."`;

export function BriefModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { setDeck } = useDeckStore();
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleGenerate = async () => {
    if (!brief.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      const deck: Deck = data.deck;
      setDeck(deck);
      router.push(`/deck/${deck.id}`);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-grey-800 border border-grey-700 rounded-2xl w-full max-w-xl mx-4 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl text-grey-100">Generate from a brief</h2>
            <p className="text-grey-400 text-sm mt-1">
              Describe your deck and Claude will build a 6-slide draft in seconds.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-grey-500 hover:text-grey-200 p-1 rounded transition"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
          disabled={loading}
          className="w-full bg-grey-900 border border-grey-700 rounded-lg px-3 py-2.5 text-sm text-grey-100 placeholder:text-grey-600 resize-none focus:outline-none focus:border-green-400 transition disabled:opacity-50"
        />

        {error && (
          <p className="text-pink-400 text-sm mt-2">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-grey-300 hover:text-grey-100 rounded transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !brief.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-400 hover:bg-green-300 text-grey-900 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate deck
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
