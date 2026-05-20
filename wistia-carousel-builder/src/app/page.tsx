import Link from "next/link";

/**
 * Landing page — also a smoke test for the brand foundation.
 * If this renders correctly with Walsheim + the color swatches, M1 is done.
 */
export default function Home() {
  const swatches = [
    { name: "blue", hex: "#2A49E5" },
    { name: "green", hex: "#45B82E" },
    { name: "yellow", hex: "#D8DB24" },
    { name: "orange", hex: "#FF6E42" },
    { name: "pink", hex: "#FF42B4" },
    { name: "purple", hex: "#D65CFF" },
  ];

  return (
    <main className="min-h-screen bg-blue-100">
      <div className="mx-auto max-w-5xl px-8 py-24">
        {/* Eyebrow */}
        <div className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          Internal tools — Wistia social
        </div>

        {/* Big headline — testing Walsheim Black */}
        <h1 className="font-display text-7xl font-black leading-[0.95] tracking-tight text-blue-800">
          Carousel
          <br />
          builder.
        </h1>

        {/* Body copy — testing Inter */}
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-blue-700">
          A self-serve tool for spinning up on-brand Instagram and LinkedIn
          carousels. Pick a format, drop in your copy, export the whole set as
          a zip.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-3.5 font-display text-base font-bold text-white shadow-elevation-1 transition hover:bg-blue-600"
          >
            Start a carousel
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://wistia.github.io/brand/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            Brand guidelines
          </a>
        </div>

        {/* Color swatches — visible proof the palette is wired up */}
        <div className="mt-24">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-grey-600">
            Color palette
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {swatches.map((s) => (
              <div
                key={s.name}
                className="rounded-xl p-4 shadow-elevation-3"
                style={{ background: s.hex }}
              >
                <div className="font-display text-sm font-bold capitalize text-white drop-shadow">
                  {s.name}
                </div>
                <div className="text-xs font-medium text-white/80">{s.hex}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
