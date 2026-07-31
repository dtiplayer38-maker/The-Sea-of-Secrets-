import { useEffect, useState } from "react";

/** Animated cinematic ocean: sky gradient, clouds, birds, waves, particles, moving ships. */
export function OceanScene({
  weather = "clear",
  className = "",
}: {
  weather?: "clear" | "storm" | "fog" | "sunset";
  className?: string;
}) {
  const [particles, setParticles] = useState<{ l: number; d: number; s: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 26 }, () => ({
        l: Math.random() * 100,
        d: Math.random() * 14,
        s: 9 + Math.random() * 10,
      })),
    );
  }, []);

  const sky =
    weather === "storm"
      ? "linear-gradient(180deg, oklch(0.18 0.03 265), oklch(0.12 0.03 255))"
      : weather === "sunset"
        ? "linear-gradient(180deg, oklch(0.35 0.12 40), oklch(0.2 0.07 300), oklch(0.13 0.04 255))"
        : weather === "fog"
          ? "linear-gradient(180deg, oklch(0.32 0.02 240), oklch(0.16 0.03 250))"
          : "linear-gradient(180deg, oklch(0.22 0.07 258), oklch(0.13 0.045 250))";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0" style={{ background: sky }} />

      {/* moon / sun */}
      <div
        className="anim-pulse-glow absolute right-[12%] top-[8%] h-24 w-24 rounded-full blur-[2px]"
        style={{
          background:
            weather === "sunset"
              ? "radial-gradient(circle, oklch(0.9 0.14 60), transparent 70%)"
              : "radial-gradient(circle, oklch(0.95 0.03 240), transparent 70%)",
        }}
      />

      {/* clouds */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            top: `${8 + i * 11}%`,
            width: `${220 + i * 90}px`,
            height: `${60 + i * 18}px`,
            background: "oklch(0.7 0.03 250 / 0.16)",
            animation: `drift-cloud ${70 + i * 35}s linear ${i * -20}s infinite`,
          }}
        />
      ))}

      {/* birds */}
      {[0, 1, 2].map((i) => (
        <div
          key={`b${i}`}
          className="absolute text-xs opacity-50"
          style={{
            top: `${16 + i * 6}%`,
            color: "oklch(0.85 0.02 250)",
            animation: `drift-cloud ${38 + i * 9}s linear ${i * -12}s infinite`,
          }}
        >
          ᨏ &nbsp; ᨏ
        </div>
      ))}

      {/* distant ships */}
      <div
        className="absolute bottom-[36%] text-2xl opacity-60"
        style={{ animation: "drift-cloud 95s linear infinite", color: "oklch(0.75 0.1 230)" }}
      >
        ⛵
      </div>
      <div
        className="absolute bottom-[42%] text-lg opacity-40"
        style={{ animation: "drift-cloud 140s linear -40s infinite", color: "oklch(0.8 0.1 85)" }}
      >
        ⛵
      </div>

      {/* particles / sea spray */}
      {particles.map((p, i) => (
        <span
          key={`p${i}`}
          className="absolute bottom-0 h-1 w-1 rounded-full"
          style={{
            left: `${p.l}%`,
            background: "oklch(0.85 0.12 230 / 0.7)",
            animation: `spark-rise ${p.s}s linear ${p.d}s infinite`,
          }}
        />
      ))}

      {/* waves */}
      {[
        { c: "oklch(0.35 0.1 235 / 0.55)", h: 90, s: 18, b: -10 },
        { c: "oklch(0.28 0.09 240 / 0.7)", h: 70, s: 26, b: -24 },
        { c: "oklch(0.19 0.06 245 / 0.9)", h: 60, s: 34, b: -34 },
      ].map((w, i) => (
        <div
          key={`w${i}`}
          className="absolute left-0 w-[200%]"
          style={{
            bottom: w.b,
            height: w.h,
            background: `radial-gradient(ellipse at 25% 0%, transparent 0 40px, ${w.c} 41px), radial-gradient(ellipse at 75% 0%, transparent 0 40px, ${w.c} 41px)`,
            backgroundSize: "160px 100%",
            animation: `wave-drift ${w.s}s linear infinite`,
          }}
        />
      ))}

      {weather === "fog" && (
        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{ background: "oklch(0.7 0.02 240 / 0.14)" }}
        />
      )}
      {weather === "storm" && (
        <div className="absolute inset-0" style={{ background: "oklch(0.1 0.03 255 / 0.35)" }} />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 20%, oklch(0.1 0.04 250 / 0.75) 100%)",
        }}
      />
    </div>
  );
}
