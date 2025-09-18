// src/components/ProgressBar.tsx
export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, total)) * 100)));
  return (
    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-teal-600 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        role="progressbar"
      />
    </div>
  );
}
