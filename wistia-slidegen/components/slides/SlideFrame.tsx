// components/slides/SlideFrame.tsx
'use client';

import { themes, type ThemeName } from '@/lib/themes';
import { WistiaMark } from './WistiaMark';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  themeName: ThemeName;
  showLogo: boolean;
  children: ReactNode;
  className?: string;
  // when true, render at fullscreen; otherwise scaled-to-fit 16:9
  fullScreen?: boolean;
};

/**
 * Every slide is a 1600x900 (16:9) virtual canvas that scales down to fit.
 * Using a fixed virtual size + CSS transform: scale() means typography looks
 * identical at any container size — exactly like Keynote / Google Slides.
 */
export function SlideFrame({ themeName, showLogo, children, className, fullScreen }: Props) {
  const theme = themes[themeName];

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden',
        fullScreen ? '' : 'rounded-lg',
        className
      )}
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
      }}
    >
      <div className="absolute inset-0 px-[88px] py-[72px] flex flex-col">
        {children}
      </div>

      {showLogo && (
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2">
          <WistiaMark color={theme.fg} size={72} />
        </div>
      )}
    </div>
  );
}
