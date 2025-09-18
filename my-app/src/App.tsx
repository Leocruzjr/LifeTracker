import React, { useEffect, useState } from "react";
import NotebookHeader from "./components/NotebookHeader";
import TabBar from "./components/TabBar";
import FAB from "./components/FAB";
import NewHabitModal from "./components/NewHabitModal";
import HabitDaysModal from "./components/HabitDaysModal";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/Habits";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import { Habit, TodoGroup } from "./types";
import { loadJSON, saveJSON } from "./utils/storage";

type TabKey = "dashboard" | "habits" | "stats" | "settings";

function todayISO() { return new Date().toISOString().slice(0, 10); }
function toggleDay(arr: string[], day: string) {
  return arr.includes(day) ? arr.filter(d => d !== day) : [...arr, day];
}

const HABITS_KEY = "lifetracker_habits_v1";
const GROUPS_KEY = "lifetracker_groups_v1";

export default function App() {
  const [tab, setTab] = useState<TabKey>("dashboard");

  // ---- HABITS (persisted) ----
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadJSON<Habit[]>(HABITS_KEY, [
      // sample seed (remove if you want)
      { id: crypto.randomUUID(), name: "Brush Teeth Daily", kind: "good", targetDays: 30, startDate: todayISO(), daysChecked: [] },
      { id: crypto.randomUUID(), name: "Did not bite nails today", kind: "bad", targetDays: 21, startDate: todayISO(), daysChecked: [] },
    ])
  );
  useEffect(() => { saveJSON(HABITS_KEY, habits); }, [habits]);

  const [openNewHabit, setOpenNewHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleCreateHabit = (habit: Habit) => setHabits(prev => [habit, ...prev]);
  const handleToggleToday = (id: string) => {
    const day = todayISO();
    setHabits(prev => prev.map(h => h.id === id ? { ...h, daysChecked: toggleDay(h.daysChecked, day) } : h));
  };
  const handleDeleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));
  const handleEditDaysOpen = (h: Habit) => setEditingHabit(h);
  const handleSaveDays = (habitId: string, daysChecked: string[]) => {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, daysChecked } : h));
  };

  // ---- TODO GROUPS (persisted) ----
  const [groups, setGroups] = useState<TodoGroup[]>(() =>
    loadJSON<TodoGroup[]>(GROUPS_KEY, [
      { id: crypto.randomUUID(), name: "Home", color: "#e0f2fe", items: [] },
    ])
  );
  useEffect(() => { saveJSON(GROUPS_KEY, groups); }, [groups]);

  const addGroup = (name: string) =>
    setGroups(prev => [{ id: crypto.randomUUID(), name, color: "#e0f2fe", items: [] }, ...prev]);

  const addItem = (groupId: string, text: string) =>
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, items: [{ id: crypto.randomUUID(), text, done: false }, ...g.items] } : g
    ));

  const toggleItem = (groupId: string, itemId: string) =>
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, items: g.items.map(it => it.id === itemId ? { ...it, done: !it.done } : it) }
        : g
    ));

  const deleteItem = (groupId: string, itemId: string) =>
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, items: g.items.filter(it => it.id !== itemId) } : g
    ));

  const setGroupColor = (groupId: string, color: string) =>
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, color } : g));

  return (
    <div className="min-h-screen bg-slate-50">
      <NotebookHeader />

      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl px-4">
        <main className="pb-24 md:pb-10 pt-2">
          {tab === "dashboard" && (
            <Dashboard
              habits={habits}
              groups={groups}
              onToggleToday={handleToggleToday}
              onEditDays={(h) => setEditingHabit(h)}
              onDeleteHabit={handleDeleteHabit}
              onOpenNewHabit={() => setOpenNewHabit(true)}
              onAddGroup={addGroup}
              onAddItem={addItem}
              onToggleItem={toggleItem}
              onDeleteItem={deleteItem}
              onSetGroupColor={setGroupColor}
            />
          )}

          {tab === "habits" && (
            <HabitsPage
              habits={habits}
              groups={groups}
              onToggleToday={handleToggleToday}
              onEditDays={(h) => setEditingHabit(h)}
              onDeleteHabit={handleDeleteHabit}
              onOpenNewHabit={() => setOpenNewHabit(true)}
              onAddGroup={addGroup}
              onAddItem={addItem}
              onToggleItem={toggleItem}
              onDeleteItem={deleteItem}
              onSetGroupColor={setGroupColor}
            />
          )}

          {tab === "stats" && <Stats habits={habits} />}

          {tab === "settings" && <Settings />}
        </main>
      </div>

      <FAB onClick={() => setOpenNewHabit(true)} />
      <TabBar active={tab} onChange={(t) => setTab(t)} />

      <NewHabitModal
        open={openNewHabit}
        onClose={() => setOpenNewHabit(false)}
        onCreate={handleCreateHabit}
      />

      <HabitDaysModal
        open={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSaveDays={handleSaveDays}
      />
    </div>
  );
}
