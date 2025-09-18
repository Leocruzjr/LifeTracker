import { useRef, useState } from "react";
import { TodoGroup } from "../types";
import ColorPicker from "./ColorPicker";

export default function TodoList({
  groups,
  onAddGroup,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onSetGroupColor,
}: {
  groups: TodoGroup[];
  onAddGroup: (name: string) => void;
  onAddItem: (groupId: string, text: string) => void;
  onToggleItem: (groupId: string, itemId: string) => void;
  onDeleteItem: (groupId: string, itemId: string) => void;
  onSetGroupColor: (groupId: string, color: string) => void;
}) {
  const [newGroup, setNewGroup] = useState("");
  const newGroupRef = useRef<HTMLInputElement>(null);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">To-Do</h3>
        <div className="flex gap-2">
          <input
            ref={newGroupRef}
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="New group (e.g., Home)"
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 transition focus-visible:ring-2 focus-visible:ring-teal-500"
            onClick={() => {
              const name = newGroup.trim();
              if (name) {
                onAddGroup(name);
                setNewGroup("");
                newGroupRef.current?.focus();
              }
            }}
          >
            Add Group
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-gray-600">
          No groups yet. Create one like <span className="font-semibold">Home</span>,{" "}
          <span className="font-semibold">Work</span>, or{" "}
          <span className="font-semibold">Groceries</span>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              onAddItem={(text) => onAddItem(g.id, text)}
              onToggleItem={(itemId) => onToggleItem(g.id, itemId)}
              onDeleteItem={(itemId) => onDeleteItem(g.id, itemId)}
              onSetColor={(color) => onSetGroupColor(g.id, color)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function GroupCard({
  group,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onSetColor,
}: {
  group: TodoGroup;
  onAddItem: (text: string) => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onSetColor: (color: string) => void;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bg = group.color || "#ffffff";

  return (
    <div
      className="rounded-xl border p-4 shadow-sm hover:shadow-md transition hover:-translate-y-[1px]"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{group.name}</h4>
        <ColorPicker value={bg} onChange={onSetColor} />
      </div>

      <div className="space-y-2 mb-3">
        {group.items.map((it) => (
          <label key={it.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-teal-600"
              checked={it.done}
              onChange={() => onToggleItem(it.id)}
            />
            <span className={it.done ? "line-through text-gray-500" : ""}>
              {it.text}
            </span>
            <button
              className="ml-auto text-xs text-gray-600 hover:text-red-600"
              onClick={() => onDeleteItem(it.id)}
              title="Delete task"
            >
              Delete
            </button>
          </label>
        ))}
        {group.items.length === 0 && (
          <p className="text-sm text-gray-600">No tasks yet.</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white/80"
        />
        <button
          className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 transition focus-visible:ring-2 focus-visible:ring-teal-500"
          onClick={() => {
            const t = text.trim();
            if (t) {
              onAddItem(t);
              setText("");
              inputRef.current?.focus();
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
