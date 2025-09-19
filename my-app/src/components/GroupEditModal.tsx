// src/components/GroupEditModal.tsx
import { useEffect, useState } from "react";
import { TodoGroup } from "../types";

const COLORS = [
  { key: "orange", value: "#FED7AA" },
  { key: "green",  value: "#BBF7D0" },
  { key: "blue",   value: "#BFDBFE" },
  { key: "purple", value: "#DDD6FE" },
];

export default function GroupEditModal({
  open,
  group,
  onClose,
  onRename,
  onSetColor,
  onDeleteGroup,
  onSetPinned,
  onStartMove,
}: {
  open: boolean;
  group: TodoGroup | null;
  onClose: () => void;
  onRename: (id: string, name: string) => void;
  onSetColor: (id: string, color: string) => void;
  onDeleteGroup: (id: string) => Promise<void>; // await deletion before closing
  onSetPinned: (id: string, pinned: boolean) => void;
  onStartMove: (id: string) => void;
}) {
  const g = group;
  const [name, setName] = useState(g?.name ?? "");
  const [color, setColor] = useState(g?.color ?? COLORS[2].value);
  const [pinned, setPinned] = useState<boolean>(!!g?.pinned);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (g) {
      setName(g.name);
      setColor(g.color || COLORS[2].value);
      setPinned(!!g.pinned);
      setBusy(false);
    }
  }, [g?.id, open]);

  if (!open || !g) return null;

  const saveAll = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== g.name) onRename(g.id, trimmed);
    if (color && color !== g.color) onSetColor(g.id, color);
    onClose();
  };

  const del = async () => {
    try {
      setBusy(true);
      await onDeleteGroup(g.id);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border animate-[modalIn_160ms_ease]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Edit List</h3>
          <button className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
        </div>

        <div className="p-4 space-y-4">
          <label className="block text-sm">
            <span className="text-gray-600">Name</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., "Grocery List"'
            />
          </label>

          <div className="text-sm">
            <div className="text-gray-600 mb-2">Color</div>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  className={`h-8 w-8 rounded-full border ${color === c.value ? "ring-2 ring-teal-500" : ""}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.key}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => { setPinned(e.target.checked); onSetPinned(g.id, e.target.checked); }}
              />
              Pin to top
            </label>
            <button
              className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50"
              onClick={() => onStartMove(g.id)}
            >
              Move card
            </button>
          </div>
        </div>

        <div className="p-4 border-t flex gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={saveAll}
            disabled={busy}
          >
            Save
          </button>
          <button
            className="ml-auto rounded-lg px-3 py-2 text-sm text-rose-900 bg-rose-200 hover:bg-rose-300 disabled:opacity-50"
            onClick={del}
            disabled={busy}
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
}
