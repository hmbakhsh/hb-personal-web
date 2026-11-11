// App icons for side projects. Each is a rounded square in the project's
// accent, so they sit next to the work logos at any size.

// A seedling: Rootie's little root, two leaves for two profiles.
export function RootieIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="rootie-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f7dff" />
          <stop offset="1" stopColor="#1f4ee8" />
        </linearGradient>
        <linearGradient id="rootie-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#rootie-bg)" />
      <rect width="64" height="64" rx="15" fill="url(#rootie-shine)" />
      <path d="M32 42V30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M31 31.5C22.5 31.5 17 26.5 17 19C25 19 31 23.5 31 31.5Z" fill="#fff" />
      <path d="M33 27C40.5 27 46 22 46 14.5C38 14.5 33 19 33 27Z" fill="#fff" fillOpacity=".8" />
      <path d="M20 44c0-4 5.5-6 12-6s12 2 12 6c0 6-5.5 9-12 9s-12-3-12-9Z" fill="#fff" />
      <circle cx="28" cy="45" r="1.5" fill="#1f4ee8" />
      <circle cx="36" cy="45" r="1.5" fill="#1f4ee8" />
      <path d="M30 48.2q2 1.8 4 0" fill="none" stroke="#1f4ee8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="25.5" cy="47.5" r="1.6" fill="#ff8fb1" fillOpacity=".6" />
      <circle cx="38.5" cy="47.5" r="1.6" fill="#ff8fb1" fillOpacity=".6" />
    </svg>
  );
}

export function NotchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="#3a3a3f" />
      <path d="M9 0h46v18a12 12 0 0 1-12 12H21A12 12 0 0 1 9 18V0Z" fill="#000" />
      <circle cx="20" cy="17" r="4.5" fill="#30d158" />
      <rect x="28" y="12.5" width="18" height="3.5" rx="1.75" fill="#fff" />
      <rect x="28" y="19" width="12" height="3.5" rx="1.75" fill="#fff" opacity=".45" />
    </svg>
  );
}
