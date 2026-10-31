export function LogoMark({ size = 42 }: { size?: number }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#16354e" />
            <stop offset="1" stopColor="#08131f" />
          </linearGradient>
          <linearGradient id="logo-hook" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffa07a" />
            <stop offset="1" stopColor="#ff5c3b" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#logo-bg)" />
        <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="#9dc4e4" strokeOpacity="0.18" />
        <circle cx="21.5" cy="21" r="9.6" stroke="#eaf3fb" strokeWidth="2" />
        <path d="M29 29.5l7 7" stroke="#eaf3fb" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M21.5 14.5v7.8a3.9 3.9 0 0 0 7.8 0"
          stroke="url(#logo-hook)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="21.5" cy="14.5" r="1.5" fill="#ff7b56" />
        <circle cx="35.5" cy="12.5" r="2.6" fill="#35e0a1" />
      </svg>
    </span>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? 'is-compact' : ''}`}>
      <LogoMark size={compact ? 34 : 40} />
      <div className="brand-copy">
        <span className="brand-name">Lovec phishingu</span>
        <span className="brand-sub">Novaterm · security training</span>
      </div>
    </div>
  );
}
