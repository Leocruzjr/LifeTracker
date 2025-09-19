// src/pages/Dashboard.tsx
import React, { useState } from "react";
import HabitCard from "../components/HabitCard";
import TodoList from "../components/TodoList";
import { Habit, TodoGroup } from "../types";

export default function Dashboard({
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
  onOpenEditGroup,
  onEraseCompleted,
  tradeSourceHabitId,
  tradeSourceGroupId,
  onTradeHabitTarget,
  onTradeGroupTarget,
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
  onOpenEditGroup: (group: TodoGroup) => void;
  onEraseCompleted: (groupId: string) => void;
  tradeSourceHabitId?: string | null;
  tradeSourceGroupId?: string | null;
  onTradeHabitTarget?: (targetId: string) => void;
  onTradeGroupTarget?: (targetId: string) => void;
}) {
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    onAddGroup(name);
    setNewGroupName("");
  };

  return (
    <div className="px-4 py-4">
      {/* HABITS */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Habit Dashboard</h2>
        <button
          className="rounded-lg px-3 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 transition focus-visible:ring-2 focus-visible:ring-teal-500"
          onClick={onOpenNewHabit}
        >
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-gray-600">
          No habits yet. Click <span className="font-semibold">Add Habit</span> to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggleToday={onToggleToday}
              onDeleteHabit={onDeleteHabit}
              onEditDays={onEditDays}
              tradeSourceId={tradeSourceHabitId ?? null}
              onTradeTarget={onTradeHabitTarget}
            />
          ))}
        </div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* TO-DO LISTS */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">To-Do Lists</h2>
        <div className="flex items-center gap-2">
          <input
            className="w-56 md:w-64 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
            placeholder='e.g., "Grocery List"'
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreateGroup(); }}
          />
          {/* Match EXACT style as Add Habit (no disabled state) */}
          <button
            className="rounded-lg px-3 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 transition focus-visible:ring-2 focus-visible:ring-teal-500"
            onClick={handleCreateGroup}
          >
            Add Group
          </button>
        </div>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Create a list for a category. You can set its color after creating it using the color picker on the card.
      </p>

      <TodoList
        groups={groups}
        onAddGroup={onAddGroup}
        onAddItem={onAddItem}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onOpenEditGroup={onOpenEditGroup}
        onEraseCompleted={onEraseCompleted}
        tradeSourceGroupId={tradeSourceGroupId ?? null}
        onTradeTarget={onTradeGroupTarget}
      />
    </div>
  );
}
