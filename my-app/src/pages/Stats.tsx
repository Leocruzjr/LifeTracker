// src/pages/Stats.tsx
import { Habit } from "../types";

function iso(d: Date) { return d.toISOString().slice(0,10); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function dateISOToDate(s: string) { return new Date(s + "T00:00:00"); }

function withinWindowDates(h: Habit) {
  const start = dateISOToDate(h.startDate);
  const end = addDays(start, h.targetDays - 1);
  return { start, end };
}

function currentStreak(h: Habit): number {
  const { start, end } = withinWindowDates(h);
  const today = new Date(iso(new Date()) + "T00:00:00");
  const last = today < end ? today : end;
  const set = new Set(h.daysChecked);
  let count = 0;
  for (let d = last; d >= start; d = addDays(d, -1)) {
    if (set.has(iso(d))) count++;
    else break;
  }
  return count;
}

function longestStreak(h: Habit): number {
  const { start, end } = withinWindowDates(h);
  const set = new Set(h.daysChecked.filter((s) => {
    const d = dateISOToDate(s);
    return d >= start && d <= end;
  }));
  let best = 0;
  let run = 0;
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (set.has(iso(d))) { run++; best = Math.max(best, run); }
    else run = 0;
  }
  return best;
}

export default function Stats({ habits = [] as Habit[] }: { habits?: Habit[] }) {
  const totals = habits.reduce(
    (acc, h) => {
      const done = Math.min(h.daysChecked.length, h.targetDays);
      acc.done += done;
      acc.total += h.targetDays;
      acc.items.push({ id: h.id, name: h.name, done, total: h.targetDays, cs: currentStreak(h), ls: longestStreak(h) });
      return acc;
    },
    { done: 0, total: 0, items: [] as { id: string; name: string; done: number; total: number; cs: number; ls: number }[] }
  );

  const overallPct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;

  return (
    <div className="px-4 py-4">
      <h2 className="text-xl font-semibold mb-4">Stats</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Overall completion</div>
          <div className="text-3xl font-bold mt-1">{overallPct}%</div>
          <div className="text-xs text-gray-500 mt-1">{totals.done} / {totals.total} days</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Total habits</div>
          <div className="text-3xl font-bold mt-1">{habits.length}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Active today</div>
          <div className="text-3xl font-bold mt-1">
            {habits.filter(h => {
              const { start, end } = withinWindowDates(h);
              const t = dateISOToDate(iso(new Date()));
              return t >= start && t <= end;
            }).length}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-3">Per-habit</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {totals.items.map((it) => {
          const pct = Math.round((it.done / Math.max(1, it.total)) * 100);
          return (
            <div key={it.id} className="rounded-xl border bg-white p-4">
              <div className="font-semibold">{it.name}</div>
              <div className="text-xs text-gray-500 mb-2">{it.done}/{it.total} days</div>
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Current streak: <span className="font-medium">{it.cs}</span> · Longest streak: <span className="font-medium">{it.ls}</span>
              </div>
            </div>
          );
        })}
        {totals.items.length === 0 && (
          <div className="text-sm text-gray-600">No habits yet.</div>
        )}
      </div>
    </div>
  );
}
