export default function NotebookHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">LifeTracker</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline text-gray-500">Journal</span>
          <span aria-hidden>📓</span>
        </div>
      </div>
    </header>
  );
}
