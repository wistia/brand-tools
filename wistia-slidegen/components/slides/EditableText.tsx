// components/slides/EditableText.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  editable?: boolean;
  style?: React.CSSProperties;
};

export function EditableText({
  value, onChange, className, multiline, placeholder, editable = true, style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  // Only push DOM content when not focused, to avoid cursor jumping while typing.
  useEffect(() => {
    if (ref.current && !focused && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, focused]);

  if (!editable) {
    return (
      <div className={className} style={style}>
        {value || placeholder}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={cn(
        'outline-none focus:ring-2 focus:ring-white/30 rounded -mx-1 px-1 transition',
        'empty:before:content-[attr(data-placeholder)] empty:before:opacity-40',
        className
      )}
      style={style}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        onChange(e.currentTarget.textContent || '');
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    />
  );
}
