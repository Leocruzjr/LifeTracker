// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import NotebookHeader from "./components/NotebookHeader";
import TabBar from "./components/TabBar";
import NewHabitModal from "./components/NewHabitModal";
import HabitEditModal from "./components/HabitEditModal";
import GroupEditModal from "./components/GroupEditModal";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/Habits";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import { Habit, TodoGroup } from "./types";
import * as api from "./api/client";

type TabKey = "dashboard" | "habits" | "stats" | "settings";

export default function App() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [groups, setGroups] = useState<TodoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openNewHabit, setOpenNewHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingGroup, setEditingGroup] = useState<TodoGroup | null>(null);

  const [tradeHabitSource, setTradeHabitSource] = useState<string | null>(null);
  const [tradeGroupSource, setTradeGroupSource] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [hs, gs] = await Promise.all([api.listHabits(), api.listGroups()]);
        setHabits(hs);
        setGroups(gs);
        setError(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedHabits = useMemo(
    () => [...habits].sort((a, b) => (+(!!b.pinned) - + (!!a.pinned)) || (b.order ?? 0) - (a.order ?? 0)),
    [habits]
  );
  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => (+(!!b.pinned) - + (!!a.pinned)) || (b.order ?? 0) - (a.order ?? 0)),
    [groups]
  );

  // ------- HABITS -------
  const handleCreateHabit = (h: Habit) =>
    api.createHabit({ name: h.name, kind: h.kind, targetDays: h.targetDays, startDate: h.startDate })
      .then((created) => setHabits((prev) => [created, ...prev]));

  const handleToggleToday = (id: string) =>
    api.toggleHabitToday(id).then((u) => setHabits((p) => p.map((h) => (h.id === u.id ? u : h))));

  // return Promise so modal can await, then UI filters card out immediately
  const handleDeleteHabit = (id: string) =>
    api.deleteHabit(id).then(() => {
      setHabits((p) => p.filter((h) => h.id !== id));
    });

  const handleSaveDays = (habitId: string, daysChecked: string[]) =>
    api.setHabitDays(habitId, daysChecked).then((u) => setHabits((p) => p.map((h) => (h.id === u.id ? u : h))));

  const handleSaveMeta = (habitId: string, patch: Partial<{ name: string; kind: "good" | "bad"; targetDays: number; startDate: string }>) =>
    api.updateHabit(habitId, patch).then((u) => setHabits((p) => p.map((h) => (h.id === u.id ? u : h))));

  const setHabitPinned = (id: string, pinned: boolean) =>
    api.updateHabit(id, { pinned }).then((u) => setHabits((p) => p.map((h) => (h.id === u.id ? u : h))));

  const tradeHabit = async (targetId: string) => {
    if (!tradeHabitSource || tradeHabitSource === targetId) return setTradeHabitSource(null);
    const a = habits.find((h) => h.id === tradeHabitSource);
    const b = habits.find((h) => h.id === targetId);
    if (!a || !b) return setTradeHabitSource(null);
    const [uA, uB] = await Promise.all([
      api.updateHabit(a.id, { order: b.order ?? Date.now() }),
      api.updateHabit(b.id, { order: a.order ?? Date.now() }),
    ]);
    setHabits((prev) => prev.map((h) => (h.id === uA.id ? uA : h.id === uB.id ? uB : h)));
    setTradeHabitSource(null);
  };

  // ------- GROUPS -------
  const addGroup = (name: string) =>
    api.createGroup(name).then((created) => setGroups((prev) => [created, ...prev]));

  const addItem = (groupId: string, text: string) =>
    api.addTodoItem(groupId, text).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const toggleItem = (groupId: string, itemId: string) =>
    api.toggleTodoItem(groupId, itemId).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const deleteItem = (groupId: string, itemId: string) =>
    api.deleteTodoItem(groupId, itemId).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const setGroupColor = (groupId: string, color: string) =>
    api.updateGroup(groupId, { color }).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const renameGroup = (groupId: string, name: string) =>
    api.updateGroup(groupId, { name }).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const deleteGroup = (groupId: string) =>
    api.deleteGroup(groupId).then(() => setGroups((prev) => prev.filter((g) => g.id !== groupId)));

  const eraseCompleted = (groupId: string) =>
    api.eraseCompleted(groupId).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const setGroupPinned = (id: string, pinned: boolean) =>
    api.updateGroup(id, { pinned }).then((g) => setGroups((prev) => prev.map((x) => (x.id === g.id ? g : x))));

  const tradeGroup = async (targetId: string) => {
    if (!tradeGroupSource || tradeGroupSource === targetId) return setTradeGroupSource(null);
    const a = groups.find((g) => g.id === tradeGroupSource);
    const b = groups.find((g) => g.id === targetId);
    if (!a || !b) return setTradeGroupSource(null);
    const [uA, uB] = await Promise.all([
      api.updateGroup(a.id, { order: b.order ?? Date.now() }),
      api.updateGroup(b.id, { order: a.order ?? Date.now() }),
    ]);
    setGroups((prev) => prev.map((g) => (g.id === uA.id ? uA : g.id === uB.id ? uB : g)));
    setTradeGroupSource(null);
  };

  return (
    <div className="min-h-screen">
      <NotebookHeader active={tab} onChange={setTab} />
      <div className="mx-auto w-full max-w-5xl px-4">
        <main className="pb-24 md:pb-10 pt-2">
          {loading && <div className="rounded-xl border bg-white p-4">Loading…</div>}
          {!loading && error && <div className="rounded-xl border bg-white p-4 text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <>
              {tab === "dashboard" && (
                <Dashboard
                  habits={sortedHabits}
                  groups={sortedGroups}
                  onToggleToday={handleToggleToday}
                  onDeleteHabit={(id) => handleDeleteHabit(id)} // state updates immediately
                  onEditDays={(h) => setEditingHabit(h)}
                  onOpenNewHabit={() => setOpenNewHabit(true)}
                  onAddGroup={addGroup}
                  onAddItem={addItem}
                  onToggleItem={toggleItem}
                  onDeleteItem={deleteItem}
                  onOpenEditGroup={(g) => setEditingGroup(g)}
                  onEraseCompleted={eraseCompleted}
                  tradeSourceHabitId={tradeHabitSource}
                  tradeSourceGroupId={tradeGroupSource}
                  onTradeHabitTarget={tradeHabit}
                  onTradeGroupTarget={tradeGroup}
                />
              )}
              {tab === "habits" && (
                <HabitsPage
                  habits={sortedHabits}
                  groups={sortedGroups}
                  onToggleToday={handleToggleToday}
                  onDeleteHabit={(id) => handleDeleteHabit(id)}
                  onEditDays={(h) => setEditingHabit(h)}
                  onOpenNewHabit={() => setOpenNewHabit(true)}
                />
              )}
              {tab === "stats" && <Stats habits={habits} />}
              {tab === "settings" && <Settings />}
            </>
          )}
        </main>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {/* Modals */}
      <NewHabitModal open={openNewHabit} onClose={() => setOpenNewHabit(false)} onCreate={handleCreateHabit} />

      <HabitEditModal
        open={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSaveMeta={handleSaveMeta}
        onSaveDays={handleSaveDays}
        onDeleteHabit={(id) =>
          handleDeleteHabit(id).then(() => {
            setEditingHabit(null); // ensure modal closes even if parent didn't yet
          })
        }
        onSetPinned={(id, p) => setHabitPinned(id, p)}
        onStartMove={(id) => {
          setEditingHabit(null);
          setTradeHabitSource(id);
        }}
      />

      <GroupEditModal
        open={!!editingGroup}
        group={editingGroup}
        onClose={() => setEditingGroup(null)}
        onRename={(id, name) => renameGroup(id, name)}
        onSetColor={(id, color) => setGroupColor(id, color)}
        onDeleteGroup={(id) => deleteGroup(id)}
        onSetPinned={(id, p) => setGroupPinned(id, p)}
        onStartMove={(id) => {
          setEditingGroup(null);
          setTradeGroupSource(id);
        }}
      />
    </div>
  );
}
