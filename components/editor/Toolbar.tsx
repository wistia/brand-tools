// components/editor/Toolbar.tsx
'use client';

import { useDeckStore, deckToShareUrl } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, Play, MessageSquare, Sparkles, Plus, Share2, Clock, FileDown } from 'lucide-react';
import { exportDeckToPDF } from '@/lib/pdf';
import { WistiaMark } from '@/components/slides/WistiaMark';
import { cn } from '@/lib/cn';

type Props = {
  onAIEdit: () => void;
};

export function Toolbar({ onAIEdit }: Props) {
  const router = useRouter();
  const { deck, activeIndex, addSlide, setTitle } = useDeckStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [titleEditing, setTitleEditing] = useState(false);

  if (!deck) return null;

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);
    try {
      await exportDeckToPDF(deck, (done, total) => {
        setExportProgress(Math.round((done / total) * 100));
      });
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const handlePresent = () => {
    router.push(`/deck/${deck.id}/present?start=${activeIndex}`);
  };

  const shareUrl = deckToShareUrl(deck);

  return (
    <div className="h-14 bg-grey-800 border-b border-grey-700 flex items-center px-4 gap-2 shrink-0">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1 text-grey-300 hover:text-grey-100 px-2 py-1.5 rounded text-sm"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="w-px h-6 bg-grey-700 mx-2" />

      <div className="flex items-center gap-2 mr-2">
        <WistiaMark color="#F2F2F3" size={56} />
        <span className="text-grey-400 text-sm">|</span>
        <span className="text-grey-100 font-display font-semibold text-sm">SlideGen</span>
      </div>

      {titleEditing ? (
        <input
          autoFocus
          value={deck.title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitleEditing(false)}
          onKeyDown={(e) => e.key === 'Enter' && setTitleEditing(false)}
          className="bg-grey-900 border border-grey-700 rounded px-2 py-1 text-sm text-grey-100"
        />
      ) : (
        <button
          onClick={() => setTitleEditing(true)}
          className="text-grey-300 hover:text-grey-100 text-sm px-2 py-1 rounded hover:bg-grey-700"
        >
          {deck.title}
        </button>
      )}

      <div className="text-grey-400 text-xs font-mono ml-auto mr-2">
        {activeIndex + 1} / {deck.slides.length}
      </div>

      <button
        onClick={handlePresent}
        className="flex items-center gap-1.5 bg-green-400 hover:bg-green-300 text-grey-900 text-sm font-medium px-4 py-1.5 rounded"
      >
        <Play size={14} fill="currentColor" /> Present
      </button>

      <ToolbarBtn icon={<MessageSquare size={14} />} label="Comment" disabled />
      <ToolbarBtn icon={<Sparkles size={14} />} label="AI Edit" onClick={onAIEdit} />
      <ToolbarBtn icon={<Plus size={14} />} label="Slide" onClick={() => addSlide()} />

      <ToolbarBtn
        icon={<Share2 size={14} />}
        label="Share"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          setShareOpen(true);
          setTimeout(() => setShareOpen(false), 2000);
        }}
        active={shareOpen}
      />
      {shareOpen && (
        <span className="text-green-400 text-xs absolute top-16 right-32 bg-grey-900 px-2 py-1 rounded">
          Link copied!
        </span>
      )}

      <ToolbarBtn icon={<Clock size={14} />} label="Recents" onClick={() => router.push('/')} />

      <button
        onClick={handleExport}
        disabled={exporting}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded transition',
          exporting
            ? 'bg-green-700 text-grey-100'
            : 'bg-green-600 hover:bg-green-500 text-white'
        )}
      >
        <FileDown size={14} />
        {exporting ? `Exporting ${exportProgress}%` : `PDF ${deck.slides.length}/${deck.slides.length}…`}
      </button>
    </div>
  );
}

function ToolbarBtn({
  icon, label, onClick, disabled, active,
}: {
  icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded border transition',
        active
          ? 'bg-grey-700 border-grey-600 text-grey-100'
          : 'border-grey-700 text-grey-200 hover:bg-grey-700',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {icon} {label}
    </button>
  );
}
