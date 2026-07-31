import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { OceanScene } from "@/components/OceanScene";
import { CrewBadge, Parchment, PirateButton, StatBar } from "@/components/ui-kit";
import { CHARACTERS, CREWS, type Character, type CharacterId } from "@/lib/game-data";
import { CHAPTERS } from "@/lib/story";
import { Sparkles, User, Shield, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/crew/$characterId")({
  head: ({ params }) => {
    const c = CHARACTERS.find((x) => x.id === params.characterId);
    const title = c ? `${c.name} — The Sea of Secrets 🌊` : "Character — The Sea of Secrets";
    const description = c
      ? `${c.title}. ${c.tagline}`
      : "Character profile from the pirate adventure universe.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    const c = CHARACTERS.find((x) => x.id === (params.characterId as CharacterId));
    if (!c) throw notFound();
    return c;
  },
  component: CharacterPage,
  errorComponent: () => <Fallback text="This character profile could not be loaded." />,
  notFoundComponent: () => <Fallback text="No sailor found with this name." />,
});

function Fallback({ text }: { text: string }) {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-gold-gradient">{text}</p>
        <div className="mt-6">
          <PirateButton to="/crew">Back to crew list 👥</PirateButton>
        </div>
      </div>
    </div>
  );
}

function CharacterPage() {
  const character = Route.useLoaderData() as Character;
  const crew = CREWS[character.crew];
  const lines = CHAPTERS.flatMap((ch) =>
    ch.panels
      .filter((p) => p.speaker === character.id)
      .map((p) => ({ chapter: ch.title, line: p.line! })),
  ).slice(0, 4);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="relative isolate overflow-hidden border-b-2 border-primary/30">
        <OceanScene weather="sunset" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border-4 border-amber-400/60 shadow-2xl bg-black/60">
            <img
              src={character.image}
              alt={`${character.name}, ${character.title}`}
              className="anim-float size-full object-cover object-top"
            />
          </div>
          <div>
            <CrewBadge crew={character.crew} />
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-gold-gradient font-bold sm:text-6xl">
              {character.name}
            </h1>
            <p className="mt-1 font-[family-name:var(--font-title)] text-xs font-bold uppercase tracking-widest text-amber-300">
              {character.title}
            </p>
            <p className="mt-4 text-xl italic font-bold text-amber-200">“{character.tagline}”</p>
            <p className="mt-4 text-base leading-relaxed text-slate-200 font-medium">
              {character.bio}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 bg-black/40 p-4 rounded-xl border border-primary/30">
              {character.skills.map((s) => (
                <StatBar key={s.label} label={s.label} value={s.value} />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {character.equipment.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-amber-950/80 border-2 border-amber-500/50 px-3.5 py-1 text-xs font-bold text-amber-200"
                >
                  ⚔️ {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <Parchment className="border-2 border-amber-600/50">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1">
              <User className="size-4 text-amber-600" /> Personality
            </p>
            <p className="mt-2 text-base leading-relaxed font-semibold text-slate-900">
              {character.personality}
            </p>
          </Parchment>

          <Parchment className="border-2 border-amber-600/50">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1">
              <MessageCircle className="size-4 text-amber-600" /> Speaking Style
            </p>
            <p className="mt-2 text-base leading-relaxed font-semibold text-slate-900">
              {character.speaks}
            </p>
          </Parchment>

          <Parchment className="border-2 border-amber-600/50">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1">
              <Shield className="size-4 text-amber-600" /> Crew &amp; Ship
            </p>
            <p className="mt-2 text-base leading-relaxed font-semibold text-slate-900">
              {crew.badge} {crew.name} — sails aboard {character.ship}.{" "}
              {character.leader ? "Captain of the ship!" : "A loyal and brave crew member."}
            </p>
          </Parchment>
        </div>

        {lines.length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-gold-gradient">
              Favorite Story Lines 💬
            </h2>
            <div className="mt-4 space-y-3">
              {lines.map((l, i) => (
                <div key={i} className="surface-deck rounded-xl p-4 border-2 border-amber-400/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {l.chapter}
                  </p>
                  <p className="mt-1 text-base font-bold text-white">“{l.line}”</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <PirateButton to="/adventure">
            Sail with {character.name.split(" ").pop()} ⛵
          </PirateButton>
          <PirateButton to="/crew" variant="ghost">
            Back to Crew List 👥
          </PirateButton>
        </div>
      </section>
    </div>
  );
}
