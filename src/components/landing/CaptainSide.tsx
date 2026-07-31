import { useEffect, useState, type ReactNode } from "react";

/** One half of the cinematic split-screen: ship backdrop, captain artwork, CTA. */
export function CaptainSide({
  side,
  captainImage,
  captainAlt,
  shipImage,
  shipName,
  captainName,
  tagline,
  tilt,
  active,
  visible,
  onEnter,
  onLeave,
  children,
}: {
  side: "left" | "right";
  captainImage: string;
  captainAlt: string;
  shipImage: string;
  shipName: string;
  captainName: string;
  tagline: string;
  tilt: { x: number; y: number };
  active: boolean;
  visible: boolean;
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
}) {
  const gold = side === "left";
  const [motes, setMotes] = useState<{ l: number; t: number; d: number; s: number }[]>([]);

  useEffect(() => {
    setMotes(
      Array.from({ length: 20 }, () => ({
        l: Math.random() * 100,
        t: Math.random() * 100,
        d: Math.random() * 8,
        s: 6 + Math.random() * 8,
      })),
    );
  }, []);

  const glow = gold ? "oklch(0.82 0.14 66)" : "oklch(0.72 0.17 232)";

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative flex min-h-[62vh] flex-1 flex-col justify-end overflow-hidden lg:min-h-screen"
    >
      {/* ship backdrop with slow cinematic drift + parallax */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          transform: `translate3d(${tilt.x * (gold ? -18 : 18)}px, ${tilt.y * -12}px, 0)`,
          transition: "transform 900ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <img
          src={shipImage}
          alt=""
          aria-hidden
          className="size-full scale-[1.18] object-cover"
          style={{ animation: `camera-drift ${gold ? 34 : 40}s ease-in-out infinite` }}
        />
      </div>

      {/* atmosphere: mist, light rays, colour wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: gold
            ? "linear-gradient(to top, oklch(0.12 0.04 250 / 0.95) 8%, oklch(0.35 0.12 55 / 0.25) 55%, oklch(0.6 0.14 65 / 0.18))"
            : "linear-gradient(to top, oklch(0.1 0.04 250 / 0.95) 8%, oklch(0.28 0.1 235 / 0.3) 55%, oklch(0.4 0.14 235 / 0.2))",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 mix-blend-screen"
        style={{
          background: gold
            ? "conic-gradient(from 200deg at 70% 0%, transparent 0deg, oklch(0.9 0.13 70 / 0.28) 18deg, transparent 40deg, oklch(0.9 0.13 70 / 0.2) 62deg, transparent 90deg)"
            : "conic-gradient(from 200deg at 40% 0%, transparent 0deg, oklch(0.75 0.17 230 / 0.24) 20deg, transparent 44deg, oklch(0.75 0.17 230 / 0.18) 66deg, transparent 92deg)",
          animation: "ray-sweep 18s ease-in-out infinite",
        }}
      />
      {/* sea mist / fog */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 blur-2xl"
        style={{
          background: gold
            ? "linear-gradient(to top, oklch(0.85 0.06 70 / 0.22), transparent)"
            : "linear-gradient(to top, oklch(0.7 0.12 232 / 0.22), transparent)",
          animation: "fog-roll 24s ease-in-out infinite",
        }}
      />
      {/* drifting particles */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {motes.map((m, i) => (
          <span
            key={i}
            className="absolute size-[3px] rounded-full"
            style={{
              left: `${m.l}%`,
              top: `${m.t}%`,
              background: glow,
              opacity: 0.5,
              animation: `mote-drift ${m.s}s ease-in-out ${-m.d}s infinite`,
            }}
          />
        ))}
      </div>
      {/* hover energy bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 60%, ${glow} -40%, transparent 62%)` }}
      />

      {/* captain artwork — kept clean, no text overlay */}
      <div
        className="relative mx-auto flex w-full max-w-md flex-1 items-end justify-center px-4"
        style={{
          transform: `translate3d(${tilt.x * (gold ? 8 : -8)}px, 0, 0) scale(${active ? 1.03 : 1})`,
          transition: "transform 800ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <img
          src={captainImage}
          alt={captainAlt}
          className={`max-h-[52vh] w-auto object-contain drop-shadow-[0_24px_60px_oklch(0_0_0_/_0.7)] lg:max-h-[64vh] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{
            transition: "opacity 1500ms ease, transform 1500ms cubic-bezier(.2,.8,.2,1)",
            animation: "idle-breathe 6.5s ease-in-out infinite",
            filter: gold ? "saturate(1.05)" : "saturate(1.1) hue-rotate(-4deg)",
            maskImage: "linear-gradient(to top, transparent 0%, black 14%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 14%)",
          }}
        />
      </div>

      {/* caption block sits below the artwork, never on it */}
      <div
        className={`relative z-10 px-6 pb-10 text-center ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        style={{ transition: "opacity 1200ms ease 400ms, transform 1200ms ease 400ms" }}
      >
        <p
          className="font-[family-name:var(--font-title)] text-[0.6rem] uppercase tracking-[0.4em]"
          style={{ color: glow }}
        >
          {shipName}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-foreground sm:text-4xl">
          {captainName}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm italic leading-relaxed text-muted-foreground">
          {tagline}
        </p>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
