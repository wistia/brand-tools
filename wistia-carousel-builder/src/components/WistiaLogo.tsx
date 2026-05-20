interface WistiaLogoProps {
  color?: string;
  height?: number;
}

/**
 * Wistia wordmark in SVG. Inline so the export pipeline can rasterize it
 * without external requests.
 *
 * This is a simplified visual approximation, not the official logo asset.
 * For the production tool, drop the official SVG from
 * https://wistia.github.io/brand/logos/Wistia-Logos-SVG.zip into
 * /public/logos/ and swap this component for an <img> tag.
 */
export function WistiaLogo({ color = "#000833", height = 56 }: WistiaLogoProps) {
  return (
    <div className="inline-flex items-center" style={{ height }}>
      <svg
        viewBox="0 0 280 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height, width: "auto" }}
        aria-label="Wistia"
      >
        {/* Two flag marks */}
        <g fill={color}>
          <path d="M12 14 L36 14 L24 56 L0 56 Z" />
          <path d="M42 14 L66 14 L54 56 L30 56 Z" opacity="0.55" />
        </g>
        {/* Wordmark "wistia" — rounded, bold, friendly */}
        <text
          x="78"
          y="54"
          fill={color}
          fontFamily='"GT Walsheim", system-ui, sans-serif'
          fontWeight="900"
          fontSize="52"
          letterSpacing="-0.02em"
        >
          wistia
        </text>
      </svg>
    </div>
  );
}

/** Just the flag pair, for use as a small mark */
export function WistiaFlags({ color = "#000833", height = 48 }: WistiaLogoProps) {
  return (
    <svg
      viewBox="0 0 70 70"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: "auto" }}
      aria-label="Wistia"
    >
      <g fill={color}>
        <path d="M14 14 L40 14 L26 60 L0 60 Z" />
        <path d="M46 14 L70 14 L56 60 L32 60 Z" opacity="0.55" />
      </g>
    </svg>
  );
}
