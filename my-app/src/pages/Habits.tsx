// src/pages/Habits.tsx
import HabitCard from "../components/HabitCard";
import { Habit, TodoGroup } from "../types";

export default function HabitsPage({
  habits,
  groups,
  onToggleToday,
  onDeleteHabit,
  onEditDays,
  onOpenNewHabit,
}: {
  habits: Habit[];
  groups: TodoGroup[];
  onToggleToday: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditDays: (h: Habit) => void;
  onOpenNewHabit: () => void;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Habits</h2>
        <button
          className="rounded-lg px-3 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 transition focus-visible:ring-2 focus-visible:ring-teal-500"
          onClick={onOpenNewHabit}
        >
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-gray-600">
          No habits yet. Click <span className="font-semibold">Add Habit</span> to create one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggleToday={onToggleToday}
              onDeleteHabit={onDeleteHabit}
              onEditDays={onEditDays}
            />
          ))}
        </div>
      )}
    </div>
  );
}
