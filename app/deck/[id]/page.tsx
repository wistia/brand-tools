// app/deck/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDeckStore } from '@/lib/store';
import { Toolbar } from '@/components/editor/Toolbar';
import { SlideList } from '@/components/editor/SlideList';
import { Canvas } from '@/components/editor/Canvas';
import { LayoutPicker } from '@/components/editor/LayoutPicker';
import { EditPanel } from '@/components/editor/EditPanel';
import { AIEditModal } from '@/components/editor/AIEditModal';

export default function DeckPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { deck, loadOrCreate, loadFromHash } = useDeckStore();
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (id === 'shared' && typeof window !== 'undefined' && window.location.hash) {
      loadFromHash(window.location.hash);
    } else {
      loadOrCreate(id);
    }
  }, [id, loadOrCreate, loadFromHash]);

  if (!deck) {
    return (
      <div className="min-h-screen bg-grey-900 flex items-center justify-center text-grey-500">
        Loading deck…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-grey-900 overflow-hidden">
      <Toolbar onAIEdit={() => setAiOpen(true)} />
      <div className="flex-1 flex min-h-0">
        <SlideList />
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas />
          <LayoutPicker />
        </div>
        <EditPanel onAIEdit={() => setAiOpen(true)} />
      </div>
      <AIEditModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
