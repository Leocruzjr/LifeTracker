// src/components/ProgressBar.tsx
export default function ProgressBar({
  current,
  total,
  color = "#0ea5a4",
}: {
  current: number;
  total: number;
  color?: string;
}) {
  const rawPct = Math.round((current / Math.max(1, total)) * 100);
  const pct = current > 0 ? Math.max(6, Math.min(100, rawPct)) : 0; // ensure visible first-day chunk
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden" aria-hidden>
      <div
        className="h-full transition-[width] duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      />
    </div>
  );
}
