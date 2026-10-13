export function CupMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M6 12h17v7a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7v-7Z" fill="currentColor" />
      <path d="M23 14h2.5a3 3 0 0 1 0 6H23" stroke="currentColor" strokeWidth="2.2" />
      <path d="M11 4c-1.5 2 1.5 3 0 5M16 4c-1.5 2 1.5 3 0 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
