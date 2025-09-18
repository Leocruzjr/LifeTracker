import ProgressBar from "./ProgressBar";
import { Habit } from "../types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function withinWindow(habit: Habit) {
  const start = new Date(habit.startDate + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + habit.targetDays - 1);
  const now = new Date();
  const d = new Date(now.toISOString().slice(0, 10) + "T00:00:00");
  return d >= start && d <= end;
}

export default function HabitCard({
  habit,
  onToggleToday,
  onDeleteHabit,
  onEditDays,
}: {
  habit: Habit;
  onToggleToday: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditDays: (h: Habit) => void;
}) {
  const checkedToday = habit.daysChecked.includes(todayISO());
  const current = Math.min(habit.daysChecked.length, habit.targetDays);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-[1px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">
            {habit.name}{" "}
            <span className="ml-2 text-xs rounded-full px-2 py-[2px] border text-gray-600">
              {habit.kind === "good" ? "Good" : "Bad"}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Target: {habit.targetDays} day{habit.targetDays !== 1 ? "s" : ""} • Started {habit.startDate}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleToday(habit.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              ${checkedToday
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : withinWindow(habit)
                  ? "bg-white border hover:bg-gray-50"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            disabled={!withinWindow(habit)}
            title={checkedToday ? "Unmark today" : "Mark completed for today"}
          >
            {checkedToday ? "Checked ✅" : "Mark today"}
          </button>

          <button
            onClick={() => onEditDays(habit)}
            className="rounded-lg px-3 py-2 text-sm font-medium border bg-white hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Edit tracked days"
          >
            Edit days
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete habit "${habit.name}"?`)) onDeleteHabit(habit.id);
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium border text-red-600 bg-white hover:bg-red-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Delete habit"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar current={current} total={habit.targetDays} />
        <div className="mt-1 text-xs text-gray-600">
          {current} / {habit.targetDays} days
        </div>
      </div>
    </div>
  );
}
