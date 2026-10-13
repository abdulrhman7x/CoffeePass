import { CupMark } from "./Wordmark";

/** The signature motif: a punch-card row of cup stamps. */
export function StampRow({ total, filled, size = "md", animateFrom = -1 }: { total: number; filled: number; size?: "sm" | "md"; animateFrom?: number }) {
  const s = size === "sm" ? "h-7 w-7" : "h-10 w-10 sm:h-11 sm:w-11";
  return (
    <ol className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const on = i < filled;
        return (
          <li key={i} className={`${s} grid place-items-center rounded-full border-2 ${on ? "border-clay bg-clay text-cream" : "border-dashed border-bean/30 text-bean/20"}`}>
            <span className={on && i >= animateFrom && animateFrom >= 0 ? "stamp-in inline-block" : on ? "inline-block -rotate-8" : ""}>
              <CupMark className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
