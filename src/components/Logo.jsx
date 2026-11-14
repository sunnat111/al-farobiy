import React from 'react'

/** Eight-point girih star made of two rotated squares with an inner rosette. */
export function LogoMark({ className = 'h-9 w-9', gold = '#C9962B', ink = 'currentColor' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g transform="translate(24 24)">
        <rect x="-15" y="-15" width="30" height="30" rx="2.5" fill="none" stroke={gold} strokeWidth="3" />
        <rect x="-15" y="-15" width="30" height="30" rx="2.5" fill="none" stroke={gold} strokeWidth="3" transform="rotate(45)" />
        <circle r="7.5" fill={ink} />
        <path d="M0 -4.5 L1.3 -1.3 L4.5 0 L1.3 1.3 L0 4.5 L-1.3 1.3 L-4.5 0 L-1.3 -1.3Z" fill={gold} />
      </g>
    </svg>
  )
}

export function Wordmark({ light = false, compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? 'h-8 w-8' : 'h-10 w-10'} ink={light ? '#FBF8F2' : '#14275E'} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.05rem] font-bold tracking-[0.06em] ${light ? 'text-paper' : 'text-lapis-900'}`}>
          AL-FOROB
        </span>
        <span className={`mt-1 text-[0.62rem] font-semibold tracking-[0.32em] ${light ? 'text-gold-300' : 'text-gold-600'}`}>
          AVLODIDAN
        </span>
      </span>
    </span>
  )
}
