// src/components/NotebookHeader.tsx
import { useState } from "react";

type TabKey = "dashboard" | "habits" | "stats" | "settings";

export default function NotebookHeader({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const tabs: { key: TabKey; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "habits", label: "Habits" },
    { key: "stats", label: "Stats" },
    { key: "settings", label: "Settings" },
  ];
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto w-full max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">LT</span>
          <h1 className="text-base font-semibold">LifeTracker</h1>
        </div>

        <div className="relative">
          <button
            className="h-9 w-9 grid place-items-center rounded-lg border bg-white hover:bg-gray-50"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="space-y-[3px]">
              <span className="block h-[2px] w-5 bg-gray-700" />
              <span className="block h-[2px] w-5 bg-gray-700" />
              <span className="block h-[2px] w-5 bg-gray-700" />
            </div>
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden"
              onMouseLeave={() => setOpen(false)}
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { onChange(t.key); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${active === t.key ? "bg-teal-50 text-teal-700" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
