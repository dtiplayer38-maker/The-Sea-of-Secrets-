import { Link } from "@tanstack/react-router";
import {
  Play,
  Users,
  BookOpen,
  Map as MapIcon,
  Ship,
  Backpack,
  Music,
  VolumeX,
} from "lucide-react";
import { useGame } from "@/lib/game-state";
import { playTone } from "@/lib/audio";

const ITEMS = [
  { to: "/adventure", label: "Play", Icon: Play },
  { to: "/crew", label: "Characters", Icon: Users },
  { to: "/comic", label: "Story", Icon: BookOpen },
  { to: "/world", label: "World Map", Icon: MapIcon },
  { to: "/ships", label: "Fleet", Icon: Ship },
  { to: "/inventory", label: "Hold", Icon: Backpack },
] as const;

/** Game-menu strip: animated icon options + music toggle. */
export function GameMenu({ visible }: { visible: boolean }) {
  const { state, update } = useGame();

  return (
    <div
      className={`pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-primary/35 bg-[oklch(0.13_0.04_250_/_0.72)] px-2.5 py-2 backdrop-blur-md sm:gap-2 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{
        transition: "opacity 1200ms ease 900ms, transform 1200ms ease 900ms",
        boxShadow: "var(--shadow-gold)",
      }}
    >
      {ITEMS.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          onMouseEnter={() => state.soundOn && playTone(680, 0.04, "sine", 0.03)}
          onClick={() => state.soundOn && playTone(520, 0.06)}
          className="group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-[family-name:var(--font-title)] text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:bg-primary/15 hover:text-primary sm:text-[0.65rem]"
        >
          <Icon className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-125" />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
      <button
        aria-label={state.soundOn ? "Turn music off" : "Turn music on"}
        onClick={() => update((s) => ({ ...s, soundOn: !s.soundOn }))}
        className="group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-[family-name:var(--font-title)] text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:bg-primary/15 hover:text-primary sm:text-[0.65rem]"
      >
        {state.soundOn ? (
          <Music className="size-3.5 transition-transform duration-300 group-hover:scale-125" />
        ) : (
          <VolumeX className="size-3.5 transition-transform duration-300 group-hover:scale-125" />
        )}
        <span className="hidden sm:inline">Music</span>
      </button>
    </div>
  );
}
