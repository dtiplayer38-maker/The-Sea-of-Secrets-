import { Link, useRouterState } from "@tanstack/react-router";
import { Anchor, Volume2, VolumeX, User } from "lucide-react";
import { useState } from "react";
import { useGame } from "@/lib/game-state";
import { playTone } from "@/lib/audio";
import { FloatingParticles } from "./FloatingParticles";
import { PlayerAccountModal } from "./PlayerAccountModal";

const LINKS = [
  { to: "/adventure", label: "Play Game 🎮" },
  { to: "/multiplayer", label: "Pirate Squad 👥" },
  { to: "/comic", label: "Comic 📖" },
  { to: "/world", label: "Map 🗺️" },
  { to: "/crew", label: "Crew 👥" },
  { to: "/ships", label: "Ships ⛵" },
  { to: "/inventory", label: "Treasure 💎" },
];

export function SiteNav() {
  const { state, update } = useGame();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [showAccount, setShowAccount] = useState(false);

  return (
    <>
      <FloatingParticles count={15} />
      <header className="sticky top-0 z-40 border-b-2 border-primary/40 bg-[oklch(0.12_0.06_260_/_0.95)] backdrop-blur-md shadow-lg">
        <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2 group">
            <div className="p-1.5 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
              <Anchor className="size-5 shrink-0 animate-bounce" />
            </div>
            <span className="truncate font-[family-name:var(--font-display)] text-xl tracking-wide text-gold-gradient sm:text-2xl font-bold">
              The Sea of Secrets ✨
            </span>
          </Link>
          <div className="col-span-2 flex items-center gap-1.5 overflow-x-auto sm:col-auto pb-1 sm:pb-0">
            {LINKS.map((l) => {
              const active = path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => state.soundOn && playTone(520, 0.05)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-[family-name:var(--font-title)] text-xs font-bold transition-all transform hover:scale-105 ${
                    active
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md glow-gold"
                      : "bg-secondary/40 text-foreground/90 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                if (state.soundOn) playTone(600, 0.05);
                setShowAccount(true);
              }}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 font-[family-name:var(--font-title)] text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-all transform hover:scale-105"
            >
              <User className="size-3.5" />
              <span>{state.playerName}</span>
            </button>

            <button
              aria-label={state.soundOn ? "Mute sound" : "Enable sound"}
              onClick={() => update((s) => ({ ...s, soundOn: !s.soundOn }))}
              className="ml-1 shrink-0 rounded-lg p-2 bg-secondary/50 text-foreground hover:bg-primary/20 hover:text-primary transition-all"
            >
              {state.soundOn ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <PlayerAccountModal isOpen={showAccount} onClose={() => setShowAccount(false)} />
    </>
  );
}
