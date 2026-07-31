import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { CharacterCard, SectionTitle, Parchment } from "@/components/ui-kit";
import { CHARACTERS, CREWS } from "@/lib/game-data";
import { useGame } from "@/lib/game-state";
import { Heart, Users } from "lucide-react";

export const Route = createFileRoute("/crew/")({
  head: () => ({
    meta: [
      { title: "Crew Friends — The Sea of Secrets 👥" },
      {
        name: "description",
        content: "Meet Aliem, Zoëlena, Waqas, Yumna, and Saham! Read their fun stories and skills.",
      },
      { property: "og:title", content: "Crew Friends — The Sea of Secrets 👥" },
      { property: "og:description", content: "Two crews, five brave friends, one big adventure!" },
    ],
  }),
  component: CrewIndex,
});

const RELATIONSHIPS = [
  {
    a: "Waqas",
    b: "Saham",
    crew: "The Seven Seas",
    line: "Closest friends! Waqas brings big imagination and dreams, while Saham brings clever strategy and the master plan.",
  },
  {
    a: "Yumna",
    b: "Zoëlena",
    crew: "Cross-Crew Bond",
    line: "Best friends forever! Yumna reads the stars and Zoëlena reads digital code. Together, no secret stays hidden.",
  },
  {
    a: "Saham",
    b: "Zoëlena",
    crew: "Strategy & Trust",
    line: "The strategists! Saham's tactical plans match Zoëlena's digital protection. They build trust and keep everyone safe.",
  },
  {
    a: "Aliem",
    b: "Waqas",
    crew: "Captains & Partners",
    line: "Aliem brings tech and logic, Waqas brings courage and creativity. When situations seem impossible, they solve it together!",
  },
  {
    a: "Yumna",
    b: "Waqas",
    crew: "The Seven Seas",
    line: "Waqas believes in everyone's potential, and Yumna sees new possibilities in the stars to guide their adventure.",
  },
];

function CrewIndex() {
  const { state } = useGame();
  const aliemCrew = CHARACTERS.filter((c) => c.crew === "aliem");
  const waqasCrew = CHARACTERS.filter((c) => c.crew === "waqas");

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionTitle eyebrow="Meet all pirate friends 👥" title="The Pirate Crews" />

        {([CREWS.aliem, CREWS.waqas] as const).map((crew) => {
          const members = crew.id === "aliem" ? aliemCrew : waqasCrew;
          return (
            <div key={crew.id} className="mb-12">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between bg-black/40 p-4 rounded-xl border border-primary/30">
                <div>
                  <h3
                    className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-wide"
                    style={{ color: crew.color }}
                  >
                    {crew.badge} {crew.name}
                  </h3>
                  <p className="mt-1 text-xs italic font-medium text-amber-200">{crew.motto}</p>
                </div>
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/40">
                  Friendship Level {Math.min(100, state.trust[crew.id])}% ❤️
                </span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => (
                  <CharacterCard key={m.id} character={m} />
                ))}
              </div>
            </div>
          );
        })}

        <SectionTitle eyebrow="Friendship & Teamwork ❤️" title="Crew Friendships" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RELATIONSHIPS.map((r) => (
            <Parchment
              key={`${r.a}-${r.b}`}
              className="border-2 border-amber-600/50 hover:scale-105 transition-transform"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1">
                <Heart className="size-3.5 fill-amber-600 text-amber-600" /> {r.crew}
              </p>
              <h4 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                {r.a} &amp; {r.b}
              </h4>
              <p className="mt-2 text-base leading-relaxed text-slate-900 font-medium">{r.line}</p>
            </Parchment>
          ))}
        </div>
      </section>
    </div>
  );
}
