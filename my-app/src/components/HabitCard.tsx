// src/components/HabitCard.tsx
import React, { useMemo } from "react";
import { Habit } from "../types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitCard({
  habit,
  onToggleToday,
  onDeleteHabit,
  onEditDays,
  tradeSourceId,
  onTradeTarget,
}: {
  habit: Habit;
  onToggleToday: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditDays: (h: Habit) => void;
  tradeSourceId?: string | null;
  onTradeTarget?: (targetId: string) => void;
}) {
  const t = todayISO();
  const doneToday = useMemo(() => (habit.daysChecked || []).includes(t), [habit.daysChecked, t]);

  const target = Math.max(1, habit.targetDays || 1);
  const doneCount = (habit.daysChecked || []).length;
  const pct = Math.min(100, Math.round((doneCount / target) * 100));

  // accents
  const kindAccent = habit.kind === "good" ? "border-emerald-600" : "border-rose-600";
  const progressAccent = habit.kind === "good" ? "bg-emerald-500" : "bg-rose-500";
  const peekBg = habit.kind === "good" ? "bg-emerald-200" : "bg-rose-200";

  // action button states
  const baseBtn =
    "rounded-lg px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-teal-500 border";
  const btnIdle = "bg-white hover:bg-gray-50 border-gray-300 text-gray-800";
  const btnDone =
    habit.kind === "good"
      ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white"
      : "bg-rose-600 hover:bg-rose-700 border-rose-700 text-white";

  const showTrade = tradeSourceId && tradeSourceId !== habit.id;

  return (
    <div className="relative">
      {/* subtle colored background peeking from the left for 3D feel */}
      <div
        className={`pointer-events-none absolute inset-0 -translate-x-2 rounded-xl border border-black ${peekBg}`}
        aria-hidden="true"
      />
      {/* front card */}
      <div className="relative rounded-xl border border-black bg-white shadow-sm hover:shadow transition">
        {showTrade && onTradeTarget && (
          <button
            onClick={() => onTradeTarget(habit.id)}
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 text-xs rounded-md bg-amber-200 text-amber-900 border shadow"
            title="Swap position with this card"
          >
            Trade here
          </button>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">
              {habit.name} {habit.pinned && <span title="Pinned">📌</span>}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <button
                className="rounded-lg border px-2 py-1 text-sm bg-white hover:bg-gray-50"
                onClick={() => onEditDays(habit)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="rounded-lg border px-2 py-1 text-sm text-rose-900 bg-rose-200 hover:bg-rose-300"
                onClick={() => onDeleteHabit(habit.id)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className={`h-3 w-full rounded-full border ${kindAccent} bg-white overflow-hidden`}>
              <div className={`h-full ${progressAccent}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-xs text-gray-600">{pct}%</div>
          </div>

          {/* Action row */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={() => onToggleToday(habit.id)}
              className={`${baseBtn} ${doneToday ? btnDone : btnIdle}`}
              title={doneToday ? "Marked done for today" : "Mark done for today"}
            >
              {doneToday ? "Done" : "Done?"}
            </button>

            <div className="text-xs text-gray-500">
              Target: <span className="font-medium">{target} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
