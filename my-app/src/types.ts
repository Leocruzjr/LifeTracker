export type Habit = {
  id: string;
  name: string;
  kind: "good" | "bad";
  targetDays: number;
  startDate: string;      // yyyy-mm-dd
  daysChecked: string[];  // yyyy-mm-dd[]
};

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoGroup = {
  id: string;
  name: string;
  color: string;          // hex (e.g., "#e0f2fe")
  items: TodoItem[];
};
