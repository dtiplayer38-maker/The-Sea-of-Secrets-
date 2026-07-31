import { createFileRoute } from "@tanstack/react-router";
import { Ship as ShipIcon, Coins, Sparkles, Check, Anchor } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { OceanScene } from "@/components/OceanScene";
import { PirateButton, SectionTitle, Parchment, CrewBadge } from "@/components/ui-kit";
import { SHIPS } from "@/lib/game-data";
import { useGame } from "@/lib/game-state";
import { playChord } from "@/lib/audio";

export const Route = createFileRoute("/ships")({
  head: () => ({
    meta: [
      { title: "Pirate Ships & Upgrades — The Sea of Secrets ⛵" },
      {
        name: "description",
        content:
          "Upgrade The Neon Voyager and The Seven Seas! Use pirate coins to make your ship faster and stronger.",
      },
      { property: "og:title", content: "Pirate Ships — The Sea of Secrets ⛵" },
      {
        property: "og:description",
        content: "Two cool ships for two brave captains. Upgrade them both!",
      },
    ],
  }),
  component: Ships,
});

function Ships() {
  const { state, update } = useGame();

  const buy = (name: string, cost: number) => {
    if (state.coins < cost || state.upgrades.includes(name)) return;
    if (state.soundOn) playChord([392, 523, 659]);
    update((s) => ({ ...s, coins: s.coins - cost, upgrades: [...s.upgrades, name] }));
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="relative isolate overflow-hidden">
        <OceanScene weather="storm" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:justify-between">
            <div className="min-w-0">
              <SectionTitle eyebrow="Ships of the ocean ⛵" title="The Pirate Ships" />
            </div>
            <span className="mb-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-400 text-black border-2 border-white px-4 py-2 text-sm font-bold shadow-lg">
              <Coins className="size-5" /> {state.coins} Pirate Coins 🪙
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {SHIPS.map((ship) => (
              <div
                key={ship.id}
                className="surface-deck rounded-2xl p-6 border-2 border-amber-400/40 shadow-xl"
              >
                <div className="flex items-center gap-2 text-amber-300">
                  <Anchor className="size-7" />
                  <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-wide text-foreground">
                    {ship.name}
                  </h3>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                  Captain: {ship.captain}
                </p>
                <div className="mt-3">
                  <CrewBadge crew={ship.crew} />
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-200 font-medium">
                  {ship.description}
                </p>

                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-300">
                    Ship Upgrades 🛠️
                  </h4>
                  {ship.upgrades.map((u) => {
                    const owned = state.upgrades.includes(u.name);
                    const affordable = state.coins >= u.cost;
                    return (
                      <div
                        key={u.name}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 border-amber-500/30 bg-black/40 p-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-[family-name:var(--font-title)] text-base font-bold text-amber-200">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-300 font-medium">{u.effect}</p>
                        </div>
                        <button
                          disabled={owned || !affordable}
                          onClick={() => buy(u.name, u.cost)}
                          className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all transform ${
                            owned
                              ? "bg-emerald-600 text-white border border-emerald-400 flex items-center gap-1"
                              : affordable
                                ? "bg-amber-400 text-black hover:scale-105 glow-gold shadow-md"
                                : "bg-gray-800 text-gray-500 border border-gray-700"
                          }`}
                        >
                          {owned ? (
                            <>
                              <Check className="size-4" /> Bought
                            </>
                          ) : (
                            `${u.cost} coins 🪙`
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Parchment className="mt-8 border-2 border-amber-600/50">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1">
              <Sparkles className="size-4 text-amber-600" /> Captain's Tip
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-900 font-medium">
              Earn coins by playing story chapters and puzzle missions! Upgrades stay with your ship
              for the whole adventure.
            </p>
            <div className="mt-5">
              <PirateButton to="/adventure">Play Story to Earn Coins! 🪙</PirateButton>
            </div>
          </Parchment>
        </div>
      </section>
    </div>
  );
}
