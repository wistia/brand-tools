// components/slides/Layouts.tsx
'use client';

import { themes, type ThemeName } from '@/lib/themes';
import { SlideFrame } from './SlideFrame';
import { EditableText } from './EditableText';
import type { Slide } from '@/lib/types';

export type LayoutProps = {
  slide: Slide;
  themeName: ThemeName;
  editable?: boolean;
  onChange?: (patch: Partial<Slide['content']>) => void;
};

// ============ COVER ============
export function CoverLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {(c.eyebrow || editable) && (
          <EditableText
            value={c.eyebrow || ''}
            onChange={(v) => onChange?.({ eyebrow: v })}
            editable={editable}
            placeholder="EYEBROW"
            className="font-body text-[18px] tracking-[0.2em] uppercase mb-12"
            style={{ color: theme.eyebrow }}
          />
        )}
        <EditableText
          value={c.title || ''}
          onChange={(v) => onChange?.({ title: v })}
          editable={editable}
          placeholder="Your headline here"
          multiline
          className="font-display font-bold text-[96px] leading-[1.05] tracking-[-0.02em] max-w-[1200px]"
          style={{ color: theme.fg }}
        />
        {(c.subtitle || editable) && (
          <EditableText
            value={c.subtitle || ''}
            onChange={(v) => onChange?.({ subtitle: v })}
            editable={editable}
            placeholder="A supporting subtitle"
            multiline
            className="font-body text-[26px] mt-10 max-w-[900px] leading-snug"
            style={{ color: theme.muted }}
          />
        )}
      </div>
    </SlideFrame>
  );
}

// ============ SECTION ============
export function SectionLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 flex flex-col justify-center max-w-[1100px]">
        <div className="flex items-baseline gap-8 mb-10">
          <EditableText
            value={c.sectionNumber || ''}
            onChange={(v) => onChange?.({ sectionNumber: v })}
            editable={editable}
            placeholder="01"
            className="font-display font-bold text-[120px] leading-none tracking-[-0.04em]"
            style={{ color: theme.accent }}
          />
          <EditableText
            value={c.eyebrow || ''}
            onChange={(v) => onChange?.({ eyebrow: v })}
            editable={editable}
            placeholder="SECTION LABEL"
            className="font-body text-[18px] tracking-[0.2em] uppercase"
            style={{ color: theme.eyebrow }}
          />
        </div>
        <EditableText
          value={c.title || ''}
          onChange={(v) => onChange?.({ title: v })}
          editable={editable}
          placeholder="Section headline"
          multiline
          className="font-display font-bold text-[72px] leading-[1.05] tracking-[-0.02em] mb-8"
          style={{ color: theme.fg }}
        />
        <EditableText
          value={c.body || ''}
          onChange={(v) => onChange?.({ body: v })}
          editable={editable}
          placeholder="Add supporting context here."
          multiline
          className="font-body text-[26px] leading-relaxed max-w-[900px]"
          style={{ color: theme.muted }}
        />
      </div>
    </SlideFrame>
  );
}

// ============ TWO-COL ============
export function TwoColLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;
  const cols = c.columns && c.columns.length > 0
    ? c.columns
    : [
        { heading: 'Column one', body: 'Add content here.' },
        { heading: 'Column two', body: 'Add content here.' },
        { heading: 'Column three', body: 'Add content here.' },
      ];

  const updateCol = (i: number, patch: Partial<{ heading: string; body: string }>) => {
    const next = cols.map((col, idx) => (idx === i ? { ...col, ...patch } : col));
    onChange?.({ columns: next });
  };

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 flex flex-col">
        {(c.eyebrow || editable) && (
          <EditableText
            value={c.eyebrow || ''}
            onChange={(v) => onChange?.({ eyebrow: v })}
            editable={editable}
            placeholder="EYEBROW"
            className="font-body text-[18px] tracking-[0.2em] uppercase mb-6"
            style={{ color: theme.eyebrow }}
          />
        )}
        <EditableText
          value={c.title || ''}
          onChange={(v) => onChange?.({ title: v })}
          editable={editable}
          placeholder="Section title"
          className="font-display font-bold text-[60px] leading-[1.05] tracking-[-0.02em] mb-16"
          style={{ color: theme.fg }}
        />
        <div className="grid grid-cols-3 gap-12 flex-1">
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col">
              <div className="h-[3px] w-12 mb-6" style={{ backgroundColor: theme.accent }} />
              <EditableText
                value={col.heading}
                onChange={(v) => updateCol(i, { heading: v })}
                editable={editable}
                placeholder="Heading"
                className="font-display font-bold text-[32px] leading-tight mb-4"
                style={{ color: theme.fg }}
              />
              <EditableText
                value={col.body}
                onChange={(v) => updateCol(i, { body: v })}
                editable={editable}
                placeholder="Description"
                multiline
                className="font-body text-[20px] leading-relaxed"
                style={{ color: theme.muted }}
              />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// ============ BIG QUOTE ============
export function BigQuoteLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 flex flex-col justify-center max-w-[1300px]">
        <div
          className="font-display font-bold text-[140px] leading-none mb-4 select-none"
          style={{ color: theme.accent, opacity: 0.9 }}
        >
          “
        </div>
        <EditableText
          value={c.quote || ''}
          onChange={(v) => onChange?.({ quote: v })}
          editable={editable}
          placeholder="Add a memorable quote"
          multiline
          className="font-display font-bold text-[60px] leading-[1.15] tracking-[-0.02em] mb-12"
          style={{ color: theme.fg }}
        />
        <EditableText
          value={c.attribution || ''}
          onChange={(v) => onChange?.({ attribution: v })}
          editable={editable}
          placeholder="— Attribution"
          className="font-body text-[24px]"
          style={{ color: theme.muted }}
        />
      </div>
    </SlideFrame>
  );
}

// ============ HERO (image + text) ============
export function HeroLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 grid grid-cols-2 gap-16 items-center">
        <div className="flex flex-col">
          {(c.eyebrow || editable) && (
            <EditableText
              value={c.eyebrow || ''}
              onChange={(v) => onChange?.({ eyebrow: v })}
              editable={editable}
              placeholder="EYEBROW"
              className="font-body text-[18px] tracking-[0.2em] uppercase mb-6"
              style={{ color: theme.eyebrow }}
            />
          )}
          <EditableText
            value={c.title || ''}
            onChange={(v) => onChange?.({ title: v })}
            editable={editable}
            placeholder="Hero headline"
            multiline
            className="font-display font-bold text-[64px] leading-[1.05] tracking-[-0.02em] mb-6"
            style={{ color: theme.fg }}
          />
          <EditableText
            value={c.subtitle || c.body || ''}
            onChange={(v) => onChange?.({ subtitle: v })}
            editable={editable}
            placeholder="Supporting copy"
            multiline
            className="font-body text-[24px] leading-relaxed"
            style={{ color: theme.muted }}
          />
        </div>
        <div
          className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: theme.divider,
            boxShadow: '0 4px 24px 2px rgba(0,0,0,0.20)',
          }}
        >
          {c.image?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.image.src} alt={c.image.alt || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="font-body text-[18px]" style={{ color: theme.muted }}>
              Add image →
            </div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}

// ============ STATS ============
export function StatsLayout({ slide, themeName, editable, onChange }: LayoutProps) {
  const theme = themes[themeName];
  const c = slide.content;
  const stats = c.stats && c.stats.length > 0
    ? c.stats
    : [
        { value: '3x', label: 'Add a stat description' },
        { value: '40%', label: 'Add a stat description' },
        { value: '10x', label: 'Add a stat description' },
      ];

  const updateStat = (i: number, patch: Partial<{ value: string; label: string }>) => {
    const next = stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange?.({ stats: next });
  };

  return (
    <SlideFrame themeName={themeName} showLogo={slide.showLogo}>
      <div className="flex-1 flex flex-col">
        {(c.eyebrow || editable) && (
          <EditableText
            value={c.eyebrow || ''}
            onChange={(v) => onChange?.({ eyebrow: v })}
            editable={editable}
            placeholder="EYEBROW"
            className="font-body text-[18px] tracking-[0.2em] uppercase mb-6"
            style={{ color: theme.eyebrow }}
          />
        )}
        <EditableText
          value={c.title || ''}
          onChange={(v) => onChange?.({ title: v })}
          editable={editable}
          placeholder="The numbers"
          className="font-display font-bold text-[60px] leading-[1.05] tracking-[-0.02em] mb-16"
          style={{ color: theme.fg }}
        />
        <div className="grid grid-cols-3 gap-16 flex-1">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col justify-center">
              <EditableText
                value={stat.value}
                onChange={(v) => updateStat(i, { value: v })}
                editable={editable}
                placeholder="0"
                className="font-display font-bold text-[160px] leading-none tracking-[-0.04em] mb-4"
                style={{ color: theme.accent }}
              />
              <EditableText
                value={stat.label}
                onChange={(v) => updateStat(i, { label: v })}
                editable={editable}
                placeholder="Stat description"
                multiline
                className="font-body text-[22px] leading-snug max-w-[300px]"
                style={{ color: theme.muted }}
              />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// ============ DISPATCHER ============
export function SlideRenderer({ slide, deckTheme, editable, onChange }: {
  slide: Slide;
  deckTheme: ThemeName;
  editable?: boolean;
  onChange?: (patch: Partial<Slide['content']>) => void;
}) {
  const themeName = slide.themeOverride || deckTheme;
  const props: LayoutProps = { slide, themeName, editable, onChange };

  switch (slide.layout) {
    case 'cover':     return <CoverLayout {...props} />;
    case 'section':   return <SectionLayout {...props} />;
    case 'two-col':   return <TwoColLayout {...props} />;
    case 'big-quote': return <BigQuoteLayout {...props} />;
    case 'hero':      return <HeroLayout {...props} />;
    case 'stats':     return <StatsLayout {...props} />;
    default:          return <SectionLayout {...props} />;
  }
}
