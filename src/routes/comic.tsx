import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, BookOpen } from "lucide-react";
import { OceanScene } from "@/components/OceanScene";
import { SiteNav } from "@/components/SiteNav";
import { PirateButton, SectionTitle, CrewBadge } from "@/components/ui-kit";
import { TypewriterText } from "@/components/TypewriterText";
import { CHAPTERS } from "@/lib/story";
import { getCharacter } from "@/lib/game-data";
import { useGame } from "@/lib/game-state";
import { playTone } from "@/lib/audio";

export const Route = createFileRoute("/comic")({
  head: () => ({
    meta: [
      { title: "Comic Book — The Sea of Secrets 📖" },
      {
        name: "description",
        content:
          "Read the fun graphic novel story of Waqas & Aliem with speech bubbles and pictures!",
      },
      { property: "og:title", content: "Comic Book — The Sea of Secrets 📖" },
      {
        property: "og:description",
        content: "A colorful pirate graphic novel with simple words and fun art!",
      },
    ],
  }),
  component: Comic,
});

const MOOD: Record<string, { weather: "clear" | "storm" | "fog" | "sunset"; tint: string }> = {
  calm: { weather: "clear", tint: "oklch(0.6 0.12 235 / 0.16)" },
  tense: { weather: "fog", tint: "oklch(0.55 0.13 60 / 0.16)" },
  wonder: { weather: "clear", tint: "oklch(0.7 0.15 300 / 0.14)" },
  storm: { weather: "storm", tint: "oklch(0.4 0.16 25 / 0.18)" },
  triumph: { weather: "sunset", tint: "oklch(0.8 0.14 85 / 0.18)" },
};

function Comic() {
  const { state } = useGame();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [panelIdx, setPanelIdx] = useState(0);
  const [auto, setAuto] = useState(false);

  const chapter = CHAPTERS[chapterIdx];
  const panel = chapter.panels[panelIdx];
  const mood = MOOD[panel.mood];
  const character = panel.speaker ? getCharacter(panel.speaker) : null;

  const next = () => {
    if (state.soundOn) playTone(700, 0.05);
    if (panelIdx < chapter.panels.length - 1) setPanelIdx(panelIdx + 1);
    else if (chapterIdx < CHAPTERS.length - 1) {
      setChapterIdx(chapterIdx + 1);
      setPanelIdx(0);
    } else setAuto(false);
  };

  const prev = () => {
    if (panelIdx > 0) setPanelIdx(panelIdx - 1);
    else if (chapterIdx > 0) {
      setChapterIdx(chapterIdx - 1);
      setPanelIdx(CHAPTERS[chapterIdx - 1].panels.length - 1);
    }
  };

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(next, 4500);
    return () => clearTimeout(t);
  });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const totalPanels = chapter.panels.length;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle eyebrow="Comic book story mode 📖" title="The Sea of Secrets Comic" />

        <div className="mb-6 flex flex-wrap gap-2.5">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setChapterIdx(i);
                setPanelIdx(0);
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-105 ${
                i === chapterIdx
                  ? "bg-amber-400 text-black shadow-lg glow-gold border-2 border-white"
                  : "bg-secondary/70 text-foreground border border-border hover:bg-secondary"
              }`}
            >
              Chapter {c.number}: {c.title}
            </button>
          ))}
        </div>

        {/* PANEL STAGE */}
        <div className="relative isolate overflow-hidden rounded-2xl border-4 border-amber-400/60 shadow-2xl bg-black/80">
          <div className="relative aspect-16/10 w-full sm:aspect-21/9">
            <OceanScene weather={mood.weather} />
            <div className="absolute inset-0" style={{ background: mood.tint }} />

            {character && (
              <img
                key={`${chapterIdx}-${panelIdx}`}
                src={character.image}
                alt={character.name}
                className="absolute bottom-0 left-2 h-[94%] w-auto max-w-[50%] object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] duration-700 animate-pop-in"
              />
            )}

            <div
              key={`t-${chapterIdx}-${panelIdx}`}
              className={`absolute duration-500 animate-pop-in ${
                character ? "bottom-6 right-6 max-w-[50%]" : "inset-x-6 bottom-8 sm:inset-x-16"
              }`}
            >
              {panel.narration && (
                <div className="surface-parchment rounded-xl p-4 text-slate-900 font-bold text-base sm:text-lg border-2 border-amber-600 shadow-xl">
                  <TypewriterText text={panel.narration} speed={22} />
                </div>
              )}
              {panel.line && character && (
                <div className="rounded-2xl border-3 border-amber-400 bg-slate-950/95 p-5 shadow-2xl">
                  <p className="font-[family-name:var(--font-title)] text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-400" /> {character.name} says:
                  </p>
                  <p className="mt-2 text-base leading-relaxed font-bold text-white sm:text-lg">
                    “<TypewriterText text={panel.line} speed={25} />”
                  </p>
                </div>
              )}
              {panel.caption && (
                <p className="mt-4 text-center font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-wider text-rainbow-gradient sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  {panel.caption}
                </p>
              )}
            </div>

            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-black/80 border border-amber-400/50 px-3.5 py-1.5 font-[family-name:var(--font-title)] text-xs font-bold uppercase tracking-wider text-amber-300">
                Ch. {chapter.number} · Panel {panelIdx + 1}/{totalPanels}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t-2 border-amber-400/40 bg-slate-950 px-5 py-3.5">
            <button
              onClick={prev}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="size-5" /> Previous
            </button>
            <div className="flex flex-1 items-center gap-2">
              {chapter.panels.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${i <= panelIdx ? "bg-amber-400 glow-gold" : "bg-slate-800"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setAuto((a) => !a)}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/40"
            >
              {auto ? (
                <Pause className="size-4 text-amber-400" />
              ) : (
                <Play className="size-4 text-amber-400" />
              )}{" "}
              Auto Play
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
            >
              Next <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <CrewBadge crew="aliem" />
            <CrewBadge crew="waqas" />
          </div>
          <div className="flex gap-4">
            <PirateButton to="/adventure" variant="gold">
              Play This Chapter 🎮
            </PirateButton>
            <PirateButton to="/world" variant="ghost">
              World Map 🗺️
            </PirateButton>
          </div>
        </div>
      </section>
    </div>
  );
}
