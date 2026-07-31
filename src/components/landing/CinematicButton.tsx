import { useRef, useState, type ReactNode } from "react";

/** Living AAA-style menu button: floats, breathes, glows, ripples on click. */
export function CinematicButton({
  children,
  tone = "gold",
  onClick,
}: {
  children: ReactNode;
  tone?: "gold" | "neon";
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  const gold = tone === "gold";
  const glow = gold ? "oklch(0.82 0.14 60)" : "oklch(0.75 0.17 230)";

  return (
    <button
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = ++idRef.current;
        setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 700);
        onClick?.();
      }}
      className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-[family-name:var(--font-title)] text-[0.7rem] uppercase tracking-[0.25em] transition-transform duration-300 hover:scale-[1.06] active:scale-[0.98] sm:text-xs"
      style={{
        color: gold ? "oklch(0.14 0.04 250)" : "oklch(0.97 0.02 230)",
        background: gold
          ? "linear-gradient(135deg, oklch(0.88 0.13 78), oklch(0.66 0.16 45))"
          : "linear-gradient(135deg, oklch(0.5 0.16 235), oklch(0.28 0.09 250))",
        border: `1px solid ${glow}`,
        boxShadow: `0 0 0 1px ${glow}, 0 0 28px -6px ${glow}`,
        animation: "btn-float 5.5s ease-in-out infinite, btn-breathe 3.4s ease-in-out infinite",
      }}
    >
      {/* treasure shine */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, oklch(1 0 0 / 0.45) 50%, transparent 65%)",
          backgroundSize: "260% 100%",
          animation: "btn-shine 4.5s linear infinite",
        }}
      />
      {/* animated border */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 34px 2px ${glow}, inset 0 0 18px ${glow}` }}
      />
      {/* hover particles */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-1 size-1 rounded-full"
            style={{
              left: `${8 + i * 11}%`,
              background: glow,
              animation: `spark-rise ${2.4 + i * 0.25}s ease-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: r.x,
            top: r.y,
            background: "oklch(1 0 0 / 0.55)",
            animation: "ripple 700ms ease-out forwards",
          }}
        />
      ))}
      {children}
    </button>
  );
}
