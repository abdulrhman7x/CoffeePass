"use client";

import { useState } from "react";

export function BaristaDemo({ buttonLabel, notice, suggestions }: { buttonLabel: string; notice: string; suggestions: string[] }) {
  const [index, setIndex] = useState(0);
  const recommendation = suggestions[index] ?? suggestions[0] ?? "";

  return (
    <div className="mt-6">
      <p className="rounded-2xl border-s-4 border-clay bg-paper px-4 py-3 font-medium text-roast" aria-live="polite" aria-atomic="true" data-testid="text-ai-barista-suggestion">
        {recommendation}
      </p>
      <button
        type="button"
        data-testid="button-ai-barista-sample"
        onClick={() => setIndex((current) => suggestions.length ? (current + 1) % suggestions.length : 0)}
        className="mt-4 rounded-full bg-roast px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay"
      >
        {buttonLabel}
      </button>
      <p className="mt-3 text-xs text-bean/65" role="note">{notice}</p>
    </div>
  );
}
