// src/pages/Habits.tsx
import HabitCard from "../components/HabitCard";
import TodoList from "../components/TodoList";
import { Habit, TodoGroup } from "../types";

export default function HabitsPage({
  habits,
  groups,
  onToggleToday,
  onDeleteHabit,
  onEditDays,
  onOpenNewHabit,
  onAddGroup,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onSetGroupColor,
}: {
  habits: Habit[];
  groups: TodoGroup[];
  onToggleToday: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditDays: (h: Habit) => void;
  onOpenNewHabit: () => void;
  onAddGroup: (name: string) => void;
  onAddItem: (groupId: string, text: string) => void;
  onToggleItem: (groupId: string, itemId: string) => void;
  onDeleteItem: (groupId: string, itemId: string) => void;
  onSetGroupColor: (groupId: string, color: string) => void;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Habits</h2>
        <button
          className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 transition focus-visible:ring-2 focus-visible:ring-teal-500"
          onClick={onOpenNewHabit}
        >
          + New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-gray-600 mb-6">
          No habits yet. Click <span className="font-semibold">+ New Habit</span> to add your first one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
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

      {/* Optional: keep To-Do section here as well, or remove if Dashboard already shows it */}
      <TodoList
        groups={groups}
        onAddGroup={onAddGroup}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onSetGroupColor={onSetGroupColor}
      />
    </div>
  );
}
