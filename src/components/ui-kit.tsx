import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CREWS, type Character } from "@/lib/game-data";
import { playTone } from "@/lib/audio";
import { useGame } from "@/lib/game-state";

export function PirateButton({
  children,
  onClick,
  to,
  variant = "gold",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: "gold" | "sea" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const { state } = useGame();
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-[family-name:var(--font-title)] text-xs uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none";
  const styles = {
    gold: "bg-[image:var(--gradient-gold)] text-primary-foreground hover:brightness-110 hover:-translate-y-0.5 glow-gold",
    sea: "border border-accent/60 bg-accent/10 text-accent hover:bg-accent/20 hover:-translate-y-0.5",
    ghost: "border border-border text-foreground/85 hover:border-primary/70 hover:text-primary",
  }[variant];

  const handle = () => {
    if (state.soundOn) playTone(variant === "gold" ? 660 : 440, 0.09);
    onClick?.();
  };

  if (to)
    return (
      <Link to={to} onClick={handle} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handle}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Parchment({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`surface-parchment relative rounded-md p-5 ${className}`}
      style={{
        boxShadow: "inset 0 0 60px oklch(0.55 0.08 60 / 0.25), var(--shadow-deep)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-md border border-[oklch(0.45_0.07_60_/_0.4)]" />
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="font-[family-name:var(--font-title)] text-[0.65rem] uppercase tracking-[0.35em] text-primary/80">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-gold-gradient sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function CrewBadge({ crew }: { crew: Character["crew"] }) {
  const c = CREWS[crew];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-widest"
      style={{ borderColor: `color-mix(in oklab, ${c.color} 55%, transparent)`, color: c.color }}
    >
      <span aria-hidden>{c.badge}</span>
      {c.name}
    </span>
  );
}

export function CharacterCard({ character, compact }: { character: Character; compact?: boolean }) {
  return (
    <Link
      to="/crew/$characterId"
      params={{ characterId: character.id }}
      className="surface-deck group relative block overflow-hidden rounded-lg transition-all duration-500 hover:-translate-y-1 hover:glow-gold"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-4/5" : "aspect-3/4"}`}>
        <img
          src={character.image}
          alt={`${character.name} — ${character.title}`}
          loading="lazy"
          className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 40%, oklch(0.14 0.04 250 / 0.95))",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <CrewBadge crew={character.crew} />
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-wide text-foreground">
          {character.name}
        </h3>
        <p className="text-xs text-muted-foreground">{character.title}</p>
      </div>
    </Link>
  );
}

export function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-gold)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
