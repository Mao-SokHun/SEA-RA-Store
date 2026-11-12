'use client';

import React from 'react';

interface ChamferHighlightsProps {
  size?: number; // cut size in px, e.g. 16, 20, 24
  color?: 'cyan' | 'gold' | 'emerald' | 'red' | 'pink' | 'purple';
  corners?: 'both' | 'top-right' | 'bottom-left';
  className?: string;
}

const COLOR_MAP = {
  cyan: {
    stroke: '#00D4FF',
    core: '#E0F7FF',
    glow: 'rgba(0, 212, 255, 0.85)',
    filterClass: 'drop-shadow-[0_0_8px_#00D4FF]',
  },
  gold: {
    stroke: '#E5B55E',
    core: '#FFFBEA',
    glow: 'rgba(229, 181, 94, 0.9)',
    filterClass: 'drop-shadow-[0_0_8px_#E5B55E]',
  },
  emerald: {
    stroke: '#10B981',
    core: '#E6FFFA',
    glow: 'rgba(16, 185, 129, 0.85)',
    filterClass: 'drop-shadow-[0_0_8px_#10B981]',
  },
  red: {
    stroke: '#EF4444',
    core: '#FEE2E2',
    glow: 'rgba(239, 68, 68, 0.85)',
    filterClass: 'drop-shadow-[0_0_8px_#EF4444]',
  },
  pink: {
    stroke: '#EC4899',
    core: '#FCE7F3',
    glow: 'rgba(236, 72, 153, 0.85)',
    filterClass: 'drop-shadow-[0_0_8px_#EC4899]',
  },
  purple: {
    stroke: '#8B5CF6',
    core: '#EDE9FE',
    glow: 'rgba(139, 92, 246, 0.85)',
    filterClass: 'drop-shadow-[0_0_8px_#8B5CF6]',
  },
};

/**
 * ChamferHighlights renders precision glowing laser highlights
 * directly across 45-degree chamfered cut corners.
 */
export default function ChamferHighlights({
  size = 20,
  color = 'cyan',
  corners = 'both',
  className = '',
}: ChamferHighlightsProps) {
  const theme = COLOR_MAP[color] || COLOR_MAP.cyan;

  return (
    <>
      {/* Top-Right 45° Chamfer Cut Line */}
      {(corners === 'both' || corners === 'top-right') && (
        <div
          className={`absolute top-0 right-0 pointer-events-none z-30 ${className}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full overflow-visible"
          >
            {/* Outer Glow Line */}
            <line
              x1="0"
              y1="0"
              x2={size}
              y2={size}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              className={theme.filterClass}
            />
            {/* Inner Intense Core Line */}
            <line
              x1="0"
              y1="0"
              x2={size}
              y2={size}
              stroke={theme.core}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Bottom-Left 45° Chamfer Cut Line */}
      {(corners === 'both' || corners === 'bottom-left') && (
        <div
          className={`absolute bottom-0 left-0 pointer-events-none z-30 ${className}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full overflow-visible"
          >
            {/* Outer Glow Line */}
            <line
              x1="0"
              y1="0"
              x2={size}
              y2={size}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              className={theme.filterClass}
            />
            {/* Inner Intense Core Line */}
            <line
              x1="0"
              y1="0"
              x2={size}
              y2={size}
              stroke={theme.core}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </>
  );
}
