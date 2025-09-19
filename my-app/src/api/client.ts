// src/api/client.ts
import type { Habit, TodoGroup } from "../types";

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || "";

async function toJson<T>(resPromise: Promise<Response>): Promise<T> {
  const res = await resPromise;
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
const req = (path: string, init?: RequestInit) => fetch(API_BASE + path, init);

/* HABITS */
export const listHabits = (): Promise<Habit[]> => toJson(req("/api/habits"));
export const createHabit = (h: {
  name: string; kind: "good" | "bad"; targetDays: number; startDate: string;
}): Promise<Habit> =>
  toJson(req("/api/habits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(h) }));

export const updateHabit = (
  id: string,
  patch: Partial<{ name: string; kind: "good" | "bad"; targetDays: number; startDate: string; pinned: boolean; order: number }>
): Promise<Habit> =>
  toJson(req(`/api/habits/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }));

export const setHabitDays = (id: string, daysChecked: string[]): Promise<Habit> =>
  toJson(req(`/api/habits/${id}/days`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ daysChecked }) }));

export const toggleHabitToday = (id: string): Promise<Habit> => toJson(req(`/api/habits/${id}/toggle-today`, { method: "PATCH" }));
export const deleteHabit = (id: string): Promise<{ ok: true }> => toJson(req(`/api/habits/${id}`, { method: "DELETE" }));

/* GROUPS */
export const listGroups = (): Promise<TodoGroup[]> => toJson(req("/api/groups"));
export const createGroup = (name: string, color = "#e0f2fe"): Promise<TodoGroup> =>
  toJson(req("/api/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, color }) }));

export const updateGroup = (
  id: string,
  patch: Partial<{ name: string; color: string; pinned: boolean; order: number }>
): Promise<TodoGroup> =>
  toJson(req(`/api/groups/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }));

export const deleteGroup = (id: string): Promise<{ ok: true }> =>
  toJson(req(`/api/groups/${id}`, { method: "DELETE" }));

export const eraseCompleted = (groupId: string): Promise<TodoGroup> =>
  toJson(req(`/api/groups/${groupId}/erase-completed`, { method: "POST" }));

export const addTodoItem = (groupId: string, text: string): Promise<TodoGroup> =>
  toJson(req(`/api/groups/${groupId}/items`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }));

export const toggleTodoItem = (groupId: string, itemId: string): Promise<TodoGroup> =>
  toJson(req(`/api/groups/${groupId}/items/${itemId}/toggle`, { method: "PATCH" }));

export const deleteTodoItem = (groupId: string, itemId: string): Promise<TodoGroup> =>
  toJson(req(`/api/groups/${groupId}/items/${itemId}`, { method: "DELETE" }));
