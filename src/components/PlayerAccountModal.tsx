import { useState } from "react";
import { User, LogIn, Plus, RefreshCw, CheckCircle2, Shield, Sparkles, Trophy } from "lucide-react";
import { useGame } from "@/lib/game-state";
import { PirateButton, Parchment } from "./ui-kit";
import { playTone, playChord } from "@/lib/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerAccountModal({ isOpen, onClose }: Props) {
  const { state, profiles, loginPlayer, switchProfile, startNewGame } = useGame();
  const [nameInput, setNameInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) return;
    loginPlayer(clean);
    if (state.soundOn) playChord([523, 659, 784]);
    setMsg(`Welcome aboard, ${clean}! ⛵`);
    setNameInput("");
    setTimeout(() => {
      setMsg(null);
      onClose();
    }, 1200);
  };

  const handleSwitch = (id: string, name: string) => {
    switchProfile(id);
    if (state.soundOn) playTone(580, 0.1);
    setMsg(`Loaded saved progress for ${name}! 🌊`);
    setTimeout(() => {
      setMsg(null);
      onClose();
    }, 1000);
  };

  const handleNewGame = () => {
    if (
      confirm(
        "Start a new game from Chapter 1? Your coins and items for this profile will be reset to the beginning!",
      )
    ) {
      startNewGame();
      if (state.soundOn) playTone(300, 0.15);
      setMsg("Fresh save started at Chapter 1! 🚀");
      setTimeout(() => {
        setMsg(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border-4 border-amber-400/80 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-amber-400 p-2 text-black">
              <User className="size-6" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-amber-300">
                Sailor Login & Profiles
              </h2>
              <p className="text-xs text-amber-200/80 font-medium">
                Save your adventure or switch sailor accounts!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-bold hover:bg-secondary text-amber-200"
          >
            ✕ Close
          </button>
        </div>

        {msg && (
          <div className="mt-4 rounded-xl border border-emerald-400 bg-emerald-950/80 p-3 text-center text-sm font-bold text-emerald-300 animate-pop-in">
            {msg}
          </div>
        )}

        {/* Current Active Account */}
        <div className="mt-5 rounded-xl border-2 border-amber-500/40 bg-amber-950/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-400">
                Active Sailor Account
              </p>
              <p className="font-[family-name:var(--font-title)] text-xl font-bold text-white mt-0.5">
                👤 {state.playerName}
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Saved
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="rounded-lg bg-black/40 p-2 border border-amber-500/20">
              <span className="text-amber-400 block text-[0.65rem]">Chapter</span>
              <span className="text-base text-white">Ch {state.chapter}</span>
            </div>
            <div className="rounded-lg bg-black/40 p-2 border border-amber-500/20">
              <span className="text-amber-400 block text-[0.65rem]">Coins</span>
              <span className="text-base text-amber-300">{state.coins} 🪙</span>
            </div>
            <div className="rounded-lg bg-black/40 p-2 border border-amber-500/20">
              <span className="text-amber-400 block text-[0.65rem]">Treasures</span>
              <span className="text-base text-cyan-300">{state.items.length} 💎</span>
            </div>
          </div>
        </div>

        {/* Login or Create Account */}
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
            Login or Create New Sailor Account
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your sailor name (e.g. Captain Aiza)"
              className="flex-1 rounded-xl border-2 border-amber-500/50 bg-black/60 px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 font-[family-name:var(--font-title)] text-xs font-bold text-black shadow-md transition-all hover:scale-105 disabled:opacity-40"
            >
              <LogIn className="size-4" /> Login
            </button>
          </div>
        </form>

        {/* Switch Existing Profiles */}
        {profiles.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              Saved Sailor Accounts ({profiles.length})
            </p>
            <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isActive = p.id === state.playerId;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-500/20 text-white font-bold"
                        : "border-slate-700 bg-black/30 text-slate-300 hover:border-amber-500/50"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">👤 {p.name}</span>
                      <span className="text-[0.7rem] text-amber-200/80">
                        Chapter {p.chapter} · {p.coins} coins
                      </span>
                    </div>
                    {isActive ? (
                      <span className="text-[0.65rem] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitch(p.id, p.name)}
                        className="rounded-lg bg-amber-400 px-3 py-1 font-bold text-black hover:bg-yellow-300"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Start Fresh Save */}
        <div className="mt-6 border-t border-amber-500/30 pt-4 flex justify-between items-center">
          <button
            onClick={handleNewGame}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-red-950/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-900/60"
          >
            <RefreshCw className="size-3.5" /> Start Chapter 1 Fresh
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-amber-400 px-5 py-2 font-[family-name:var(--font-title)] text-xs font-bold text-black hover:bg-yellow-300"
          >
            Done ⛵
          </button>
        </div>
      </div>
    </div>
  );
}
