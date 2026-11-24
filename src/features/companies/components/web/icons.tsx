import React from 'react';
import type { ReactNode } from 'react';
import { Path, Svg } from 'react-native-svg';

export interface CompanyIconProps {
  size?: number;
  color: string;
}

function GlyphIcon({
  size = 18,
  children,
}: {
  size?: number;
  children: ReactNode;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );
}

function StrokePath({ d, color, fill = 'none' }: { d: string; color: string; fill?: string }) {
  return (
    <Path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function ChevronDownIcon({ size, color }: CompanyIconProps) {
  return (
    <GlyphIcon size={size}>
      <StrokePath d="M6 9l6 6 6-6" color={color} />
    </GlyphIcon>
  );
}

export function CheckIcon({ size, color }: CompanyIconProps) {
  return (
    <GlyphIcon size={size}>
      <StrokePath d="M5 13l4 4L19 7" color={color} />
    </GlyphIcon>
  );
}

export function StarIcon({ size, color, filled = false }: CompanyIconProps & { filled?: boolean }) {
  return (
    <GlyphIcon size={size}>
      <StrokePath
        d="M12 3.5l2.6 5.26 5.8.84-4.2 4.1.99 5.78L12 16.75l-5.19 2.73.99-5.78-4.2-4.1 5.8-.84L12 3.5z"
        color={color}
        fill={filled ? color : 'none'}
      />
    </GlyphIcon>
  );
}

export function EditIcon({ size, color }: CompanyIconProps) {
  return (
    <GlyphIcon size={size}>
      <StrokePath d="M12 20h9" color={color} />
      <StrokePath
        d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
        color={color}
      />
    </GlyphIcon>
  );
}

export function CloseIcon({ size, color }: CompanyIconProps) {
  return (
    <GlyphIcon size={size}>
      <StrokePath d="M18 6L6 18M6 6l12 12" color={color} />
    </GlyphIcon>
  );
}

export function BuildingIcon({ size, color }: CompanyIconProps) {
  return (
    <GlyphIcon size={size}>
      <StrokePath d="M4 21V5l8-2v18" color={color} />
      <StrokePath d="M12 9h8v12" color={color} />
      <StrokePath d="M8 9h1M8 13h1M8 17h1M16 13h1M16 17h1" color={color} />
    </GlyphIcon>
  );
}
