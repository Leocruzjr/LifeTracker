// src/types.ts
export type Habit = {
  id: string;
  name: string;
  kind: "good" | "bad";
  targetDays: number;
  startDate: string;
  daysChecked: string[];
  pinned?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoGroup = {
  id: string;
  name: string;
  color: string;
  items: TodoItem[];
  pinned?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};
