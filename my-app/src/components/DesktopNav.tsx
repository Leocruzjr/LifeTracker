// src/components/DesktopNav.tsx
type TabKey = "home" | "habits" | "stats" | "settings";

export default function DesktopNav({
  active,
  onChange,
}: { active: TabKey; onChange: (t: TabKey) => void }) {
  const item = (key: TabKey, label: string, icon: string) => (
    <button
      key={key}
      onClick={() => onChange(key)}
      className={`w-full text-left px-3 py-2 rounded-lg transition
        ${active === key ? "bg-teal-50 text-teal-700" : "hover:bg-gray-50 text-gray-700"}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );

  return (
    <aside className="hidden md:block">
      <div className="sticky top-[64px] space-y-2">
        {item("home", "Journal", "📓")}
        {item("habits", "Habits", "✅")}
        {item("stats", "Stats", "📊")}
        {item("settings", "Settings", "⚙️")}
      </div>
    </aside>
  );
}
