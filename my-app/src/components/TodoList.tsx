// src/components/TodoList.tsx
import { useState } from "react";
import { TodoGroup } from "../types";

export default function TodoList({
  groups,
  onAddGroup, // not used here
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onOpenEditGroup,
  onEraseCompleted, // kept for compatibility; no button rendered
  tradeSourceGroupId,
  onTradeTarget,
}: {
  groups: TodoGroup[];
  onAddGroup: (name: string) => void;
  onAddItem: (groupId: string, text: string) => void;
  onToggleItem: (groupId: string, itemId: string) => void;
  onDeleteItem: (groupId: string, itemId: string) => void;
  onOpenEditGroup: (group: TodoGroup) => void;
  onEraseCompleted: (groupId: string) => void; // not used visually
  tradeSourceGroupId?: string | null;
  onTradeTarget?: (targetId: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleAdd = (gid: string) => {
    const text = (drafts[gid] || "").trim();
    if (!text) return;
    onAddItem(gid, text);
    setDrafts((d) => ({ ...d, [gid]: "" }));
  };

  const hasGroups = groups.length > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {!hasGroups && (
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 rounded-xl border bg-white p-4 text-gray-600">
          No groups yet. Use the field above to add one.
        </div>
      )}

      {groups.map((g) => {
        const showTrade = tradeSourceGroupId && tradeSourceGroupId !== g.id;
        // Keep the approved look: solid black border + soft pastel fill
        const bg = `linear-gradient(180deg, ${g.color}4D 0%, ${g.color}33 50%, ${g.color}1A 100%), #ffffff`;

        return (
          <div
            key={g.id}
            className="relative rounded-xl border border-black shadow-sm hover:shadow transition"
            style={{ background: bg }}
          >
            {showTrade && onTradeTarget && (
              <button
                onClick={() => onTradeTarget(g.id)}
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 text-xs rounded-md bg-amber-200 text-amber-900 border shadow"
                title="Swap position with this card"
              >
                Trade here
              </button>
            )}

            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold truncate">
                  {g.name} {g.pinned && <span title="Pinned">📌</span>}
                </h3>

                <button
                  onClick={() => onOpenEditGroup(g)}
                  className="rounded-lg border px-2 py-1 text-sm bg-white hover:bg-gray-50 transition"
                  title="Edit list"
                >
                  Edit
                </button>
              </div>

              <ul className="mt-3 space-y-2">
                {g.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-teal-600"
                      checked={it.done}
                      onChange={() => onToggleItem(g.id, it.id)}
                    />
                    <span className={`text-sm flex-1 ${it.done ? "line-through text-gray-500" : ""}`}>
                      {it.text}
                    </span>
                    <button
                      className="text-xs text-gray-500 hover:text-red-600"
                      onClick={() => onDeleteItem(g.id, it.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
                {g.items.length === 0 && <li className="text-sm text-gray-600">No items yet.</li>}
              </ul>

              <div className="mt-3 flex items-center gap-2">
                <input
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add a task…"
                  value={drafts[g.id] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [g.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd(g.id);
                  }}
                />
                <button
                  className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 transition"
                  onClick={() => handleAdd(g.id)}
                >
                  Add
                </button>
              </div>

              {/* Removed the "erase completed To-Dos" button per request */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
