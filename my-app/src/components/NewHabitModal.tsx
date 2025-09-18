// src/components/NewHabitModal.tsx
import { useEffect, useRef, useState } from "react";
import { Habit } from "../types";

export default function NewHabitModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (habit: Habit) => void;
}) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"good" | "bad">("good");
  const [targetDays, setTargetDays] = useState(30);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));

  const firstRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => firstRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const create = () => {
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      kind,
      targetDays: Math.max(1, Number(targetDays)),
      startDate,
      daysChecked: [],
    };
    onCreate(habit);
    setName("");
    setKind("good");
    setTargetDays(30);
    setStartDate(new Date().toISOString().slice(0, 10));
    onClose();
  };

  const canSave = name.trim().length > 0 && targetDays > 0;

  return (
    <div
      className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
      aria-label="New habit"
    >
      <div
        className="w-full sm:max-w-md bg-white sm:rounded-2xl shadow-2xl sm:border"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold">New Habit</h3>
          <button className="p-1 text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </header>

        <div className="px-4 py-3 space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Habit name</label>
            <input
              ref={firstRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder='e.g., "Stop smoking" or "Read Everyday"'
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Kind</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    kind === "good" ? "bg-teal-50 border-teal-500" : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setKind("good")}
                >
                  Good
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    kind === "bad" ? "bg-teal-50 border-teal-500" : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setKind("bad")}
                >
                  Bad
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Target days</label>
              <select
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                value={targetDays}
                onChange={(e) => setTargetDays(parseInt(e.target.value, 10))}
              >
                {[7, 14, 21, 30, 60, 90].map((n) => (
                  <option key={n} value={n}>{n} days</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Start date</label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <footer className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button className="px-3 py-2 rounded-lg border hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={create}
            className={`px-3 py-2 rounded-lg text-white transition ${
              canSave ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-300"
            }`}
          >
            Create
          </button>
        </footer>
      </div>
    </div>
  );
}
