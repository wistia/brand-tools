// components/slides/SlideStage.tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const STAGE_W = 1600;
const STAGE_H = 900;

/**
 * Renders children inside a 1600x900 stage that scales to fit the parent
 * container while preserving 16:9 aspect ratio. This is how you get pixel-
 * perfect typography that looks identical at every zoom level.
 */
export function SlideStage({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        const s = Math.min(width / STAGE_W, height / STAGE_H);
        setScale(s);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          pointerEvents: interactive ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const STAGE = { W: STAGE_W, H: STAGE_H };
