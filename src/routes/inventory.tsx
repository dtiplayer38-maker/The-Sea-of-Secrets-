import { createFileRoute } from "@tanstack/react-router";
import { Coins, KeyRound, Gem, Package, Trophy, RotateCcw, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { PirateButton, SectionTitle, Parchment } from "@/components/ui-kit";
import { ITEMS, ACHIEVEMENTS, ISLANDS } from "@/lib/game-data";
import { CHAPTERS } from "@/lib/story";
import { useGame } from "@/lib/game-state";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Treasure Bag & Trophies — The Sea of Secrets 💎" },
      {
        name: "description",
        content: "Check your keys, relics, coins, and trophies in your treasure bag!",
      },
      { property: "og:title", content: "Treasure Bag — The Sea of Secrets 💎" },
      {
        property: "og:description",
        content: "All your collected treasures, keys, and trophy badges!",
      },
    ],
  }),
  component: Inventory,
});

const ICONS = { Key: KeyRound, Coin: Coins, Relic: Gem, Equipment: Package };

function Inventory() {
  const { state, reset } = useGame();

  const stats = [
    { label: "Chapters Done", value: `${state.completedChapters.length}/${CHAPTERS.length}` },
    { label: "Islands Found", value: `${state.islands.length}/${ISLANDS.length}` },
    { label: "Treasures", value: `${state.items.length}/${ITEMS.length}` },
    { label: "Pirate Coins", value: `${state.coins} 🪙` },
  ];

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle eyebrow="Your Pirate Loot 💎" title="Treasure Bag & Progress" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="surface-deck rounded-2xl p-5 text-center border-2 border-amber-400/40"
            >
              <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-gold-gradient">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-[family-name:var(--font-display)] text-3xl font-bold text-gold-gradient">
          Treasures &amp; Items 💎
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => {
            const owned = item.kind === "Coin" ? state.coins > 0 : state.items.includes(item.name);
            const Icon = ICONS[item.kind];
            return (
              <div
                key={item.id}
                className={`surface-deck rounded-2xl p-5 border-2 transition-all ${
                  owned ? "border-amber-400/60 glow-gold" : "border-slate-800 opacity-40"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary inline-block">
                  <Icon className="size-6" />
                </div>
                <p className="mt-3 font-[family-name:var(--font-title)] text-lg font-bold text-foreground">
                  {owned ? item.name : "Hidden Treasure"}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                  {item.kind}
                </p>
                <p className="mt-2 text-sm text-slate-300 font-medium">
                  {owned ? item.lore : "Find this on your adventure!"}
                </p>
              </div>
            );
          })}
        </div>

        <h3 className="mt-10 flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl font-bold text-gold-gradient">
          <Trophy className="size-6 text-amber-400" /> Trophies &amp; Badges
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const got = state.achievements.includes(a.id);
            return (
              <Parchment
                key={a.id}
                className={`border-2 ${got ? "border-amber-500" : "border-gray-400 opacity-60"}`}
              >
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                  {got ? "⭐" : "☆"} {a.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{a.detail}</p>
              </Parchment>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <PirateButton to="/adventure">Continue Adventure ⛵</PirateButton>
          <PirateButton variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" /> Start Over
          </PirateButton>
        </div>
      </section>
    </div>
  );
}
