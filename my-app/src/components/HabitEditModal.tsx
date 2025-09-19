// src/components/HabitEditModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Habit } from "../types";

/* ---------- safe helpers ---------- */
const todayISO = () => new Date().toISOString().slice(0, 10);

const validISO = (iso?: string): string => {
  if (!iso) return todayISO();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return todayISO();
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? todayISO() : iso;
};

const toInt = (v: unknown, min = 1) => {
  const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? Math.max(min, n) : min;
};

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return todayISO();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const dayRange = (startISO: string, count: number) => {
  const start = validISO(startISO);
  const c = toInt(count, 1);
  const arr: string[] = [];
  for (let i = 0; i < c; i++) arr.push(addDays(start, i));
  return arr;
};

/* ---------- component ---------- */
export default function HabitEditModal({
  open,
  habit,
  onClose,
  onSaveMeta,
  onSaveDays,
  onDeleteHabit,
  onSetPinned,
  onStartMove,
}: {
  open: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSaveMeta: (id: string, patch: Partial<Pick<Habit, "name" | "kind" | "targetDays" | "startDate">>) => void;
  onSaveDays: (id: string, days: string[]) => void;
  onDeleteHabit: (id: string) => Promise<void>;
  onSetPinned: (id: string, pinned: boolean) => void;
  onStartMove: (id: string) => void;
}) {
  const h = habit;

  // local state with safe defaults (hooks must be top-level)
  const [name, setName] = useState(h?.name ?? "");
  const [kind, setKind] = useState<"good" | "bad">(h?.kind ?? "good");
  const [targetDays, setTargetDays] = useState<number>(toInt(h?.targetDays, 1));
  const [startDate, setStartDate] = useState<string>(validISO(h?.startDate));
  const [days, setDays] = useState<string[]>(Array.isArray(h?.daysChecked) ? h!.daysChecked : []);
  const [pinned, setPinned] = useState<boolean>(!!h?.pinned);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!h) return;
    setName(h.name ?? "");
    setKind(h.kind ?? "good");
    setTargetDays(toInt(h.targetDays, 1));
    setStartDate(validISO(h.startDate));
    setDays(Array.isArray(h.daysChecked) ? h.daysChecked : []);
    setPinned(!!h.pinned);
    setBusy(false);
  }, [h?.id, open]);

  const safeTarget = useMemo(() => toInt(targetDays, 1), [targetDays]);
  const windowDays = useMemo(() => dayRange(startDate, safeTarget), [startDate, safeTarget]);

  // Only after all hooks: early return if closed or no habit
  if (!open || !h) return null;

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const saveMeta = () =>
    onSaveMeta(h.id, {
      name: (name || "").trim(),
      kind,
      targetDays: safeTarget,
      startDate: validISO(startDate),
    });

  const saveDays = () => onSaveDays(h.id, days);

  const del = async () => {
    try {
      setBusy(true);
      await onDeleteHabit(h.id); // remove in backend + parent state
      onClose();                 // close modal immediately
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-white rounded-xl shadow-2xl border overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Edit Habit</h3>
          <button className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm col-span-2">
              <span className="text-gray-600">Name</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-600">Type</span>
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => setKind("good")}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    kind === "good" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Good
                </button>
                <button
                  onClick={() => setKind("bad")}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    kind === "bad" ? "bg-rose-600 text-white border-rose-600" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Bad
                </button>
              </div>
            </label>

            <label className="block text-sm">
              <span className="text-gray-600">Target days</span>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                value={safeTarget}
                onChange={(e) => setTargetDays(toInt(e.target.value, 1))}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-600">Start date</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                value={startDate}
                onChange={(e) => setStartDate(validISO(e.target.value))}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => {
                  setPinned(e.target.checked);
                  onSetPinned(h.id, e.target.checked);
                }}
              />
              Pin to top
            </label>

            <button
              className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50"
              onClick={() => onStartMove(h.id)}
            >
              Move card
            </button>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Days</div>
            <div className="grid grid-cols-7 gap-2">
              {windowDays.map((d) => {
                const on = days.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`h-9 rounded-lg text-xs border ${
                      on ? "bg-teal-600 text-white border-teal-600" : "bg-white hover:bg-gray-50"
                    }`}
                    title={d}
                  >
                    {d.slice(5)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex flex-wrap gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={saveMeta}
            disabled={busy}
          >
            Save Details
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={saveDays}
            disabled={busy}
          >
            Save Days
          </button>
          <button
            className="ml-auto rounded-lg px-3 py-2 text-sm text-rose-900 bg-rose-2 00 hover:bg-rose-300 disabled:opacity-50"
            onClick={del}
            disabled={busy}
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
}
