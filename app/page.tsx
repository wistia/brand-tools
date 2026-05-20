// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { getRecents } from '@/lib/store';
import { themes } from '@/lib/themes';
import { WistiaMark } from '@/components/slides/WistiaMark';
import { BriefModal } from '@/components/editor/BriefModal';
import { Plus, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [recents, setRecents] = useState<ReturnType<typeof getRecents>>([]);
  const [briefOpen, setBriefOpen] = useState(false);

  useEffect(() => {
    setRecents(getRecents());
  }, []);

  const newDeck = () => {
    const id = nanoid(10);
    router.push(`/deck/${id}`);
  };

  return (
    <div className="min-h-screen bg-grey-900 text-grey-100">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <WistiaMark color="#F2F2F3" size={120} />
            <span className="text-grey-400 text-2xl font-light">|</span>
            <h1 className="text-3xl font-display font-semibold">SlideGen</h1>
          </div>
        </div>

        <h2 className="text-5xl font-display font-bold mb-3 tracking-tight">
          On-brand decks. <span className="text-blue-400">In minutes.</span>
        </h2>
        <p className="text-grey-400 text-lg mb-12 max-w-2xl">
          A slide generator that knows the Wistia brand inside and out. Pick a
          paper, write your story, share a link.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <button
            onClick={newDeck}
            className="group bg-blue-500 hover:bg-blue-400 rounded-xl p-8 text-left transition"
          >
            <Plus size={28} className="mb-4" />
            <div className="font-display font-bold text-2xl mb-1">New deck</div>
            <div className="text-blue-100 text-sm flex items-center gap-1">
              Start with a Wistia template <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </button>

          <button
            onClick={() => setBriefOpen(true)}
            className="group bg-grey-800 hover:bg-grey-700 rounded-xl p-8 border border-grey-700 hover:border-green-400 text-left transition"
          >
            <Sparkles size={28} className="mb-4 text-green-400" />
            <div className="font-display font-bold text-2xl mb-1">From a brief</div>
            <div className="text-grey-400 group-hover:text-grey-300 text-sm flex items-center gap-1 transition">
              Paste a doc or paragraph — AI builds a 6-slide draft <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>

        {recents.length > 0 && (
          <div>
            <div className="text-grey-400 text-xs tracking-[0.2em] uppercase font-mono mb-4">
              Recents
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recents.map((r) => (
                <button
                  key={r.id}
                  onClick={() => router.push(`/deck/${r.id}`)}
                  className="bg-grey-800 hover:bg-grey-700 border border-grey-700 rounded-lg p-4 text-left transition flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: themes[r.theme].bg, color: themes[r.theme].fg }}
                  >
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.title}</div>
                    <div className="text-grey-500 text-xs mt-0.5">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BriefModal open={briefOpen} onClose={() => setBriefOpen(false)} />
    </div>
  );
}
