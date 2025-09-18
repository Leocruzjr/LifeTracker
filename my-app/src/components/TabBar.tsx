// src/components/TabBar.tsx
type TabKey = "dashboard" | "habits" | "stats" | "settings";

export default function TabBar({
  active,
  onChange,
}: { active: TabKey; onChange: (t: TabKey) => void }) {
  const base = "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs";
  const activeCls = "text-teal-600";
  const idleCls = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:hidden">
      <div className="mx-auto max-w-md grid grid-cols-4">
        <button className={`${base} ${active === "dashboard" ? activeCls : idleCls}`} onClick={() => onChange("dashboard")}>
          <span>🏠</span><span>To-Do Lists</span>
        </button>
        <button className={`${base} ${active === "habits" ? activeCls : idleCls}`} onClick={() => onChange("habits")}>
          <span>✅</span><span>Habits</span>
        </button>
        <button className={`${base} ${active === "stats" ? activeCls : idleCls}`} onClick={() => onChange("stats")}>
          <span>📊</span><span>Stats</span>
        </button>
        <button className={`${base} ${active === "settings" ? activeCls : idleCls}`} onClick={() => onChange("settings")}>
          <span>⚙️</span><span>Settings</span>
        </button>
      </div>
    </nav>
  );
}
