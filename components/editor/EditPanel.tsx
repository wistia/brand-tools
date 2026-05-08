// components/editor/EditPanel.tsx
'use client';

import { useDeckStore } from '@/lib/store';
import { themes, themeList, type ThemeName } from '@/lib/themes';
import { cn } from '@/lib/cn';
import { Upload, Link as LinkIcon, X, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';

const LAYOUT_LABELS: Record<string, string> = {
  cover: 'Cover Slide',
  section: 'Section Slide',
  'two-col': 'Two-Column Slide',
  'big-quote': 'Quote Slide',
  hero: 'Hero Slide',
  stats: 'Stats Slide',
};

function ThemeSwatch({
  theme,
  selected,
  onClick,
  showLabel = true,
}: {
  theme: typeof themes[ThemeName];
  selected: boolean;
  onClick: () => void;
  showLabel?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1 p-1 rounded border-2 transition text-left',
        selected ? 'border-green-400' : 'border-transparent hover:border-grey-600'
      )}
    >
      <div className="flex h-7 rounded overflow-hidden">
        {theme.swatch.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      {showLabel && (
        <span className="text-[10px] tracking-[0.15em] font-mono text-grey-300 uppercase px-1">
          {theme.label}
        </span>
      )}
    </button>
  );
}

function DefaultSwatch({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1 p-1 rounded border-2 transition text-left',
        selected ? 'border-green-400' : 'border-transparent hover:border-grey-600'
      )}
    >
      <div className="h-7 rounded bg-grey-700 flex items-center justify-center">
        <span className="text-grey-400 text-xs">—</span>
      </div>
      <span className="text-[10px] tracking-[0.15em] font-mono text-grey-300 uppercase px-1">
        Default
      </span>
    </button>
  );
}

export function EditPanel({ onAIEdit }: { onAIEdit: () => void }) {
  const { deck, activeIndex, setTheme, setSlideTheme, toggleLogo, updateContent } = useDeckStore();
  const [imageUrlOpen, setImageUrlOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (!deck) return null;
  const slide = deck.slides[activeIndex];
  if (!slide) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateContent(activeIndex, { image: { src: reader.result as string, alt: file.name } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-[300px] shrink-0 bg-grey-800 border-l border-grey-700 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div>
          <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-1">
            Edit
          </div>
          <h2 className="text-grey-100 text-xl font-display font-semibold">
            {LAYOUT_LABELS[slide.layout]}
          </h2>
        </div>

        <button
          onClick={onAIEdit}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-grey-700 hover:bg-grey-600 text-grey-100 text-sm font-medium transition"
        >
          <Sparkles size={14} className="text-green-400" /> AI Edit this slide
        </button>

        {/* DECK COLOR */}
        <div>
          <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">
            Deck Color
          </div>
          <div className="grid grid-cols-2 gap-1">
            {themeList.map((t) => (
              <ThemeSwatch
                key={t.name}
                theme={t}
                selected={deck.theme === t.name}
                onClick={() => setTheme(t.name)}
              />
            ))}
          </div>
        </div>

        {/* THIS SLIDE */}
        <div>
          <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">
            This Slide
          </div>
          <div className="grid grid-cols-3 gap-1">
            <DefaultSwatch
              selected={slide.themeOverride === null}
              onClick={() => setSlideTheme(activeIndex, null)}
            />
            {themeList.map((t) => (
              <ThemeSwatch
                key={t.name}
                theme={t}
                selected={slide.themeOverride === t.name}
                onClick={() => setSlideTheme(activeIndex, t.name)}
                showLabel={false}
              />
            ))}
          </div>
        </div>

        {/* LOGO */}
        <div>
          <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">
            Logo
          </div>
          <button
            onClick={() => toggleLogo(activeIndex)}
            className="flex items-center gap-3 w-full"
          >
            <span
              className={cn(
                'w-10 h-6 rounded-full relative transition',
                slide.showLogo ? 'bg-green-400' : 'bg-grey-700'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all',
                  slide.showLogo ? 'left-[18px]' : 'left-0.5'
                )}
              />
            </span>
            <span className="text-grey-200 text-sm font-display font-semibold">wistia</span>
          </button>
        </div>

        {/* IMAGE — only relevant for hero layout */}
        {slide.layout === 'hero' && (
          <div>
            <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">
              Image
            </div>
            <div className="flex border-b border-grey-700 mb-3">
              <button
                onClick={() => setImageUrlOpen(false)}
                className={cn(
                  'flex-1 py-2 text-xs font-medium border-b-2 transition',
                  !imageUrlOpen ? 'border-green-400 text-grey-100' : 'border-transparent text-grey-400'
                )}
              >
                Upload
              </button>
              <button
                onClick={() => setImageUrlOpen(true)}
                className={cn(
                  'flex-1 py-2 text-xs font-medium border-b-2 transition',
                  imageUrlOpen ? 'border-green-400 text-grey-100' : 'border-transparent text-grey-400'
                )}
              >
                URL
              </button>
            </div>

            {!imageUrlOpen ? (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 border border-dashed border-grey-600 hover:border-green-400 rounded text-grey-300 hover:text-green-400 text-sm flex items-center justify-center gap-2 transition"
                >
                  <Upload size={14} /> Choose file
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-grey-900 border border-grey-700 rounded px-2 py-1.5 text-sm text-grey-100 placeholder:text-grey-500"
                />
                <button
                  onClick={() => {
                    if (urlInput) {
                      updateContent(activeIndex, { image: { src: urlInput } });
                      setUrlInput('');
                    }
                  }}
                  className="px-3 rounded bg-green-400 hover:bg-green-300 text-grey-900 text-sm font-medium"
                >
                  <LinkIcon size={14} />
                </button>
              </div>
            )}

            {slide.content.image?.src && (
              <div className="mt-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.content.image.src}
                  alt=""
                  className="w-full aspect-video object-cover rounded"
                />
                <button
                  onClick={() => updateContent(activeIndex, { image: null })}
                  className="absolute top-1 right-1 p-1 rounded bg-grey-900/80 text-grey-100 hover:bg-pink-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        <div>
          <div className="text-grey-400 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">
            Notes
          </div>
          <textarea
            value={slide.notes}
            onChange={(e) => useDeckStore.getState().updateSlide(activeIndex, { notes: e.target.value })}
            placeholder="Presenter notes..."
            rows={4}
            className="w-full bg-grey-900 border border-grey-700 rounded px-2 py-1.5 text-sm text-grey-100 placeholder:text-grey-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
