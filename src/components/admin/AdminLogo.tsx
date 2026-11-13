import React from 'react'

const Star = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <g transform="translate(24 24)">
      <rect x="-15" y="-15" width="30" height="30" rx="2.5" fill="none" stroke="#C9962B" strokeWidth="3" />
      <rect x="-15" y="-15" width="30" height="30" rx="2.5" fill="none" stroke="#C9962B" strokeWidth="3" transform="rotate(45)" />
      <circle r="7.5" fill="#1E3A8A" />
      <path d="M0 -4.5 L1.3 -1.3 L4.5 0 L1.3 1.3 L0 4.5 L-1.3 1.3 L-4.5 0 L-1.3 -1.3Z" fill="#C9962B" />
    </g>
  </svg>
)

export const AdminLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Star size={56} />
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: 22 }}>AL-FOROB AVLODIDAN</div>
      <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>Boshqaruv paneli</div>
    </div>
  </div>
)

export const AdminIcon = () => <Star size={28} />
