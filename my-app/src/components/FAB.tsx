// src/components/FAB.tsx
export default function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg active:scale-95 transition"
      aria-label="Add entry"
      title="Add entry"
    >
      +
    </button>
  );
}
