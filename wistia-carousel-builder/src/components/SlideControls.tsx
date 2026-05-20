"use client";

import { CoverSlide, QuoteSlide, RichTextSlide, Slide } from "@/lib/types";
import { CarouselStore } from "@/lib/useCarousel";
import { useRef } from "react";

interface SlideControlsProps {
  store: CarouselStore;
}

/**
 * Editor controls for the active slide. Dispatches to a per-type sub-component
 * so each slide type can have its own field layout without a giant switch in
 * the parent.
 */
export function SlideControls({ store }: SlideControlsProps) {
  const { activeSlide, updateSlide } = store;
  if (!activeSlide) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">
        Content
      </div>
      <div className="rounded-xl bg-white p-4 shadow-elevation-3">
        {renderControls(activeSlide, (patch) =>
          updateSlide(activeSlide.id, patch)
        )}
      </div>
    </div>
  );
}

function renderControls(slide: Slide, update: (patch: Partial<Slide>) => void) {
  switch (slide.type) {
    case "cover":
      return (
        <CoverControls
          slide={slide}
          update={update as (p: Partial<CoverSlide>) => void}
        />
      );
    case "quote":
      return (
        <QuoteControls
          slide={slide}
          update={update as (p: Partial<QuoteSlide>) => void}
        />
      );
    case "richText":
      return (
        <RichTextControls
          slide={slide}
          update={update as (p: Partial<RichTextSlide>) => void}
        />
      );
  }
}

// ---- Variant picker (shared shape) --------------------------------------

interface VariantOption<V extends string> {
  value: V;
  label: string;
}

function VariantPicker<V extends string>({
  value,
  options,
  onChange,
}: {
  value: V;
  options: VariantOption<V>[];
  onChange: (v: V) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-grey-700">Style</span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-md border px-3 py-2 text-left transition ${
                active
                  ? "border-blue-500 bg-blue-100 text-blue-800"
                  : "border-grey-200 bg-white text-grey-700 hover:border-blue-300"
              }`}
            >
              <div className="font-display text-sm font-bold capitalize">
                {opt.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Per-type field groups ------------------------------------------------

function CoverControls({
  slide,
  update,
}: {
  slide: CoverSlide;
  update: (patch: Partial<CoverSlide>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read uploaded images as data URLs so they survive PNG export (M5).
  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = 3 - slide.images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const dataUrls = await Promise.all(
      toAdd.map(
        (f) =>
          new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = reject;
            r.readAsDataURL(f);
          })
      )
    );
    update({ images: [...slide.images, ...dataUrls] });
  };

  const removeImage = (idx: number) => {
    update({ images: slide.images.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-3">
      <VariantPicker<CoverSlide["variant"]>
        value={slide.variant}
        onChange={(variant) => update({ variant })}
        options={[
          { value: "minimal", label: "Minimal" },
          { value: "showcase", label: "Showcase" },
        ]}
      />

      <Field label="Headline" hint="Short and punchy. This is the hook.">
        <textarea
          value={slide.headline}
          onChange={(e) => update({ headline: e.target.value })}
          rows={2}
          placeholder="Your headline goes here"
          className="w-full resize-none rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>

      <Field label="Subtext (optional)" hint="One sentence of context.">
        <textarea
          value={slide.subtext ?? ""}
          onChange={(e) => update({ subtext: e.target.value })}
          rows={2}
          placeholder="What's the carousel about?"
          className="w-full resize-none rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-grey-700">
        <input
          type="checkbox"
          checked={slide.showLogo}
          onChange={(e) => update({ showLogo: e.target.checked })}
          className="h-4 w-4 rounded border-grey-300 text-blue-500"
        />
        Show Wistia logo
      </label>

      <Field
        label={`Images (${slide.images.length}/3)`}
        hint={
          slide.variant === "showcase"
            ? "First image is featured. Up to 2 more as supporting."
            : "Up to 3, shown along the bottom."
        }
      >
        <div className="flex flex-wrap gap-2">
          {slide.images.map((src, i) => (
            <div
              key={i}
              className="relative h-14 w-14 overflow-hidden rounded-md ring-1 ring-grey-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(i)}
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-800/90 text-[10px] font-bold text-white"
              >
                ×
              </button>
            </div>
          ))}
          {slide.images.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-100"
            >
              +
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
      </Field>
    </div>
  );
}

function QuoteControls({
  slide,
  update,
}: {
  slide: QuoteSlide;
  update: (patch: Partial<QuoteSlide>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <VariantPicker<QuoteSlide["variant"]>
        value={slide.variant}
        onChange={(variant) => update({ variant })}
        options={[
          { value: "light", label: "Light" },
          { value: "bold", label: "Bold" },
        ]}
      />

      <Field label="Quote" hint="Humble, wholesome, positive — Wistia's voice.">
        <textarea
          value={slide.quote}
          onChange={(e) => update({ quote: e.target.value })}
          rows={4}
          placeholder="A short, punchy testimonial that sounds like Wistia."
          className="w-full resize-none rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
      <Field label="Attribution name">
        <input
          type="text"
          value={slide.attributionName}
          onChange={(e) => update({ attributionName: e.target.value })}
          placeholder="First Last"
          className="w-full rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
      <Field label="Role / company (optional)">
        <input
          type="text"
          value={slide.attributionRole ?? ""}
          onChange={(e) => update({ attributionRole: e.target.value })}
          placeholder="Title at Company"
          className="w-full rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
    </div>
  );
}

function RichTextControls({
  slide,
  update,
}: {
  slide: RichTextSlide;
  update: (patch: Partial<RichTextSlide>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <VariantPicker<RichTextSlide["variant"]>
        value={slide.variant}
        onChange={(variant) => update({ variant })}
        options={[
          { value: "stacked", label: "Stacked" },
          { value: "split", label: "Split" },
        ]}
      />

      <Field label="Eyebrow (optional)" hint="Small label above headline.">
        <input
          type="text"
          value={slide.eyebrow ?? ""}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="What's this about?"
          className="w-full rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
      <Field label="Headline" hint="Big, bold, scannable. AP style for numbers.">
        <textarea
          value={slide.headline}
          onChange={(e) => update({ headline: e.target.value })}
          rows={2}
          placeholder="Big headlines in the header are big"
          className="w-full resize-none rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
      <Field label="Body" hint="Easygoing, calm, confident. Never pushy.">
        <textarea
          value={slide.body}
          onChange={(e) => update({ body: e.target.value })}
          rows={5}
          placeholder="Supporting copy that grounds the headline."
          className="w-full resize-none rounded-md border border-grey-200 px-3 py-2 font-body text-sm focus:border-blue-500 focus:outline-none"
        />
      </Field>
    </div>
  );
}

// ---- Field wrapper -------------------------------------------------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-grey-700">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-grey-500">{hint}</span>}
    </label>
  );
}
