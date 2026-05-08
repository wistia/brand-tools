// app/deck/[id]/present/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDeckStore } from '@/lib/store';
import { Presenter } from '@/components/present/Presenter';

export default function PresentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const search = useSearchParams();
  const start = parseInt(search.get('start') || '0', 10);
  const { deck, loadOrCreate, loadFromHash } = useDeckStore();

  useEffect(() => {
    if (id === 'shared' && typeof window !== 'undefined' && window.location.hash) {
      loadFromHash(window.location.hash);
    } else {
      loadOrCreate(id);
    }
  }, [id, loadOrCreate, loadFromHash]);

  if (!deck) return null;
  return <Presenter startIndex={start} />;
}
