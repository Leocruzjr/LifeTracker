// src/components/HabitDaysModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Habit } from "../types";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function clampToDateOnly(d: Date) {
  return new Date(iso(d) + "T00:00:00");
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function formatPretty(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function HabitDaysModal({
  open,
  habit,
  onClose,
  onSaveDays,
}: {
  open: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSaveDays: (habitId: string, daysChecked: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && habit) {
      setSelected(new Set(habit.daysChecked));
    }
  }, [open, habit]);

  const allDays = useMemo(() => {
    if (!habit) return [];
    const start = new Date(habit.startDate + "T00:00:00");
    const end = addDays(start, habit.targetDays - 1);
    const today = clampToDateOnly(new Date());
    const hardEnd = end < today ? end : today; // don't list future days
    const out: string[] = [];
    for (let d = hardEnd; d >= start; d = addDays(d, -1)) {
      out.push(iso(d));
    }
    return out;
  }, [habit]);

  if (!open || !habit) return null;

  const toggle = (day: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const canSave = true;

  return (
    <div
      className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Edit days for ${habit.name}`}
    >
      <div className="w-full sm:max-w-md bg-white sm:rounded-2xl shadow-2xl sm:border" onMouseDown={(e) => e.stopPropagation()}>
        <header className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold">Edit Days — {habit.name}</h3>
          <button className="p-1 text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </header>

        <div className="px-4 py-3">
          <p className="text-xs text-gray-600 mb-3">
            Toggle any day in the {habit.targetDays}-day window (starting {habit.startDate}).
          </p>

          <div className="max-h-[50vh] overflow-auto rounded-lg border">
            <ul className="divide-y">
              {allDays.map((d) => (
                <li key={d} className="flex items-center gap-3 px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-teal-600"
                    checked={selected.has(d)}
                    onChange={() => toggle(d)}
                    id={`day-${d}`}
                  />
                  <label htmlFor={`day-${d}`} className="text-sm">
                    {formatPretty(d)} <span className="text-xs text-gray-500">({d})</span>
                  </label>
                </li>
              ))}
              {allDays.length === 0 && (
                <li className="px-3 py-3 text-sm text-gray-600">No editable days in window yet.</li>
              )}
            </ul>
          </div>
        </div>

        <footer className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button className="px-3 py-2 rounded-lg border hover:bg-gray-50" onClick={onClose}>Cancel</button>
          <button
            disabled={!canSave}
            onClick={() => {
              onSaveDays(habit.id, Array.from(selected));
              onClose();
            }}
            className={`px-3 py-2 rounded-lg text-white transition ${canSave ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-300"}`}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
