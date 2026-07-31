import { useEffect, useState } from "react";

/** Ancient magical compass — rotates, floats, glows and emits magical dust. */
export function MagicCompass({
  tilt = { x: 0, y: 0 },
  charge = "neutral",
  visible = true,
}: {
  tilt?: { x: number; y: number };
  charge?: "neutral" | "pirate" | "neon";
  visible?: boolean;
}) {
  const [dust, setDust] = useState<{ a: number; d: number; s: number; r: number }[]>([]);

  useEffect(() => {
    setDust(
      Array.from({ length: 18 }, (_, i) => ({
        a: (i / 18) * 360 + Math.random() * 12,
        d: Math.random() * 6,
        s: 5 + Math.random() * 5,
        r: 40 + Math.random() * 46,
      })),
    );
  }, []);

  const aura =
    charge === "pirate"
      ? "oklch(0.82 0.14 84 / 0.55)"
      : charge === "neon"
        ? "oklch(0.75 0.17 230 / 0.55)"
        : "oklch(0.8 0.1 150 / 0.32)";

  return (
    <div
      aria-hidden
      className="relative size-40 sm:size-52 lg:size-60"
      style={{
        transform: `translate3d(${tilt.x * 14}px, ${tilt.y * 14}px, 0) scale(${visible ? 1 : 0.7})`,
        opacity: visible ? 1 : 0,
        transition: "transform 700ms cubic-bezier(.2,.8,.2,1), opacity 1200ms ease",
      }}
    >
      {/* energy bridge between both worlds */}
      <div
        className="anim-pulse-glow absolute left-1/2 top-1/2 h-[2px] w-[220vw] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.82 0.14 84 / 0.35) 30%, oklch(0.95 0.05 200 / 0.6) 50%, oklch(0.75 0.17 230 / 0.35) 70%, transparent)",
        }}
      />

      <div className="anim-float absolute inset-0">
        {/* halo */}
        <div
          className="anim-pulse-glow absolute -inset-10 rounded-full blur-3xl transition-[background] duration-700"
          style={{ background: `radial-gradient(circle, ${aura}, transparent 68%)` }}
        />

        {/* magical dust */}
        {dust.map((p, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 size-1 rounded-full"
            style={{
              background: i % 2 ? "oklch(0.86 0.13 88 / 0.9)" : "oklch(0.8 0.16 232 / 0.9)",
              transform: `rotate(${p.a}deg) translateY(-${p.r}px)`,
              animation: `compass-dust ${p.s}s ease-in-out ${-p.d}s infinite`,
            }}
          />
        ))}

        {/* outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-primary/50"
          style={{ animation: "compass-spin 48s linear infinite", boxShadow: "var(--shadow-gold)" }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top"
              style={{
                transform: `rotate(${i * 15}deg)`,
                background:
                  i % 6 === 0
                    ? "linear-gradient(to bottom, oklch(0.86 0.13 88 / 0.9), transparent 34%)"
                    : "linear-gradient(to bottom, oklch(0.86 0.13 88 / 0.35), transparent 18%)",
              }}
            />
          ))}
        </div>

        {/* inner face */}
        <div
          className="absolute inset-[14%] rounded-full border border-primary/40"
          style={{
            background:
              "radial-gradient(circle at 35% 28%, oklch(0.34 0.05 250), oklch(0.14 0.04 250) 70%)",
            animation: "compass-spin 26s linear infinite reverse",
          }}
        >
          {/* needle */}
          <div
            className="absolute inset-0"
            style={{ animation: "needle-sway 9s ease-in-out infinite" }}
          >
            <span
              className="absolute left-1/2 top-1/2 h-[36%] w-[3px] -translate-x-1/2 -translate-y-full rounded-full"
              style={{ background: "linear-gradient(to top, transparent, oklch(0.7 0.19 25))" }}
            />
            <span
              className="absolute left-1/2 top-1/2 h-[36%] w-[3px] -translate-x-1/2 rounded-full"
              style={{ background: "linear-gradient(to bottom, transparent, oklch(0.86 0.13 88))" }}
            />
          </div>
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[var(--shadow-gold)]" />
        </div>
      </div>
    </div>
  );
}
