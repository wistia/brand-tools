"use client";

import { ColorName, colorHex } from "@/lib/types";
import { CarouselStore } from "@/lib/useCarousel";

interface GlobalControlsProps {
  store: CarouselStore;
}

// Colors users can pick. Excludes ink/white from the swatch grid because
// they only have one shade and would look out of place visually.
const PICKABLE_COLORS: ColorName[] = [
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "grey",
];

export function GlobalControls({ store }: GlobalControlsProps) {
  const { carousel, setFormat, setColorScheme } = store;
  const { format, colorScheme } = carousel;

  return (
    <div className="flex flex-col gap-5">
      {/* ---- Format -------------------------------------------------- */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">
          Format
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FormatButton
            label="1:1 Square"
            sub="1080 × 1080"
            shape="square"
            active={format === "square"}
            onClick={() => setFormat("square")}
          />
          <FormatButton
            label="4:5 Portrait"
            sub="1080 × 1350"
            shape="portrait"
            active={format === "portrait"}
            onClick={() => setFormat("portrait")}
          />
        </div>
      </div>

      {/* ---- Color scheme -------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">
          Color scheme
        </div>

        <ColorRow
          label="Primary"
          value={colorScheme.primary}
          onChange={(c) => setColorScheme({ ...colorScheme, primary: c })}
        />
        <ColorRow
          label="Accent"
          value={colorScheme.accent}
          onChange={(c) => setColorScheme({ ...colorScheme, accent: c })}
        />
      </div>
    </div>
  );
}

// ---- Subcomponents -------------------------------------------------------

function FormatButton({
  label,
  sub,
  shape,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  shape: "square" | "portrait";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        active
          ? "border-blue-500 bg-blue-100"
          : "border-grey-200 bg-white hover:border-blue-300"
      }`}
    >
      {/* Tiny aspect-ratio icon */}
      <div
        className={`shrink-0 rounded ${
          active ? "bg-blue-500" : "bg-grey-300"
        }`}
        style={
          shape === "square"
            ? { width: 18, height: 18 }
            : { width: 16, height: 20 }
        }
      />
      <div>
        <div className="font-display text-sm font-bold text-blue-800">
          {label}
        </div>
        <div className="text-[10px] text-grey-600">{sub}</div>
      </div>
    </button>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ColorName;
  onChange: (c: ColorName) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-grey-700">{label}</span>
        <span className="font-display text-xs font-bold capitalize text-blue-800">
          {value}
        </span>
      </div>
      <div className="flex gap-1.5">
        {PICKABLE_COLORS.map((c) => {
          const selected = c === value;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={`Set ${label.toLowerCase()} to ${c}`}
              className={`h-7 w-7 rounded-full transition ${
                selected
                  ? "ring-2 ring-blue-800 ring-offset-2 ring-offset-white"
                  : "ring-1 ring-black/5 hover:scale-110"
              }`}
              style={{ background: colorHex(c, "500") }}
            />
          );
        })}
      </div>
    </div>
  );
}
