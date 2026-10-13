export function DemoBanner({ label, text }: { label: string; text: string }) {
  return (
    <p role="note" className="flex items-start gap-3 rounded-2xl border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-bean">
      <span className="shrink-0 rounded-full bg-clay px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cream">{label}</span>
      <span>{text}</span>
    </p>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">{children}</p>;
}
