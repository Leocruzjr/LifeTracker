import { useEffect, useRef, useState } from "react";

export const DEFAULT_PALETTE = [
  { name: "Light Blue",   value: "#e0f2fe" }, // sky-100
  { name: "Light Teal",   value: "#ccfbf1" }, // teal-100
  { name: "Light Violet", value: "#ede9fe" }, // violet-100
  { name: "Light Yellow", value: "#fef9c3" }, // yellow-100
  { name: "Light Rose",   value: "#ffe4e6" }, // rose-100
  { name: "Light Gray",   value: "#f3f4f6" }, // gray-100
];

export default function ColorPicker({
  value,
  onChange,
  palette = DEFAULT_PALETTE,
}: {
  value: string;
  onChange: (color: string) => void;
  palette?: { name: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Multicolored trigger stays multicolored always */}
      <button
        type="button"
        className="h-8 w-8 rounded-full border shadow-sm hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Pick group color"
        title="Pick a color"
        onClick={() => setOpen((v) => !v)}
        style={{
          background:
            "conic-gradient(#e0f2fe 0 60deg, #ccfbf1 60deg 120deg, #ede9fe 120deg 180deg, #fef9c3 180deg 240deg, #ffe4e6 240deg 300deg, #f3f4f6 300deg 360deg)",
        }}
      />

      {open && (
        <div
          role="menu"
          aria-label="Color options"
          className="absolute right-0 top-full z-20 mt-2 rounded-lg border bg-white p-2 shadow-lg"
        >
          <div className="grid grid-cols-6 gap-2">
            {palette.map((c) => {
              const selected = value === c.value;
              return (
                <button
                  key={c.value}
                  role="menuitemradio"
                  aria-checked={selected}
                  title={c.name}
                  onClick={() => {
                    onChange(c.value);
                    setOpen(false);
                  }}
                  className={`h-7 w-7 rounded-full border shadow-sm hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    selected ? "ring-2 ring-teal-500" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
