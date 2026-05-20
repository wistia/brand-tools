// components/slides/WistiaMark.tsx
'use client';

import { wistiaLockupSVG } from '@/lib/tokens';

export function WistiaMark({ color, size = 80 }: { color: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: (size / 120) * 24 }}
      dangerouslySetInnerHTML={{ __html: wistiaLockupSVG(color) }}
    />
  );
}
