"use client";

import { Slide, SlideType } from "@/lib/types";
import { CarouselStore } from "@/lib/useCarousel";

interface TemplatePickerProps {
  store: CarouselStore;
}

const TEMPLATES: { type: SlideType; label: string; description: string }[] = [
  {
    type: "cover",
    label: "Cover",
    description: "Big text, optional logo + images",
  },
  {
    type: "quote",
    label: "Quote",
    description: "Pull quote with attribution",
  },
  {
    type: "richText",
    label: "Rich text",
    description: "Eyebrow, headline, body",
  },
];

export function TemplatePicker({ store }: TemplatePickerProps) {
  const { activeSlide, changeSlideType } = store;
  if (!activeSlide) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">
        Template
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TEMPLATES.map((t) => {
          const selected = activeSlide.type === t.type;
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => {
                if (!selected) changeSlideType(activeSlide.id, t.type);
              }}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                selected
                  ? "border-blue-500 bg-blue-100 text-blue-800"
                  : "border-grey-200 bg-white text-grey-700 hover:border-blue-300"
              }`}
            >
              <div className="font-display text-sm font-bold">{t.label}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-grey-600">
                {t.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Re-export for convenience in case other components need it
export type { Slide };
