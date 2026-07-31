import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, Skull, Sparkles, Star, Trophy, Heart } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CharacterCard, SectionTitle, Parchment } from "@/components/ui-kit";
import { CaptainSide } from "@/components/landing/CaptainSide";
import { CinematicButton } from "@/components/landing/CinematicButton";
import { GameMenu } from "@/components/landing/GameMenu";
import { MagicCompass } from "@/components/landing/MagicCompass";
import { TypewriterText } from "@/components/TypewriterText";
import { CHARACTERS, CREWS, ENEMIES, ISLANDS } from "@/lib/game-data";
import { useGame } from "@/lib/game-state";
import { playChord, playTone } from "@/lib/audio";
import { startAmbience, type AmbienceHandle } from "@/lib/ambience";
import sevenSeasShip from "@/assets/ship-seven-seas.jpg";
import neonVoyagerShip from "@/assets/ship-neon-voyager.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "🏴‍☠️ The Sea of Secrets — Choose Your Captain 🌊" },
      {
        name: "description",
        content:
          "Two ships, two captains, two philosophies, one ocean. Sail with Pirate Waqas or Captain Aliem!",
      },
      { property: "og:title", content: "🏴‍☠️ The Sea of Secrets — Choose Your Captain 🌊" },
      {
        property: "og:description",
        content:
          "Two ships, two captains, two philosophies, one ocean. Begin your fun pirate adventure!",
      },
    ],
  }),
  component: Home,
});

type Mood = "neutral" | "pirate" | "neon";

function Home() {
  const { state } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [mood, setMood] = useState<Mood>("neutral");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flyTo, setFlyTo] = useState<null | "waqas" | "aliem">(null);
  const ambience = useRef<AmbienceHandle | null>(null);

  const aliem = CHARACTERS.find((c) => c.id === "aliem")!;
  const waqas = CHARACTERS.find((c) => c.id === "waqas")!;
  const aliemCrew = CHARACTERS.filter((c) => c.crew === "aliem");
  const waqasCrew = CHARACTERS.filter((c) => c.crew === "waqas");

  useEffect(() => {
    const timers = [200, 900, 1500, 2100, 2900].map((ms, i) =>
      setTimeout(() => setPhase(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!state.soundOn) {
      ambience.current?.stop();
      ambience.current = null;
      return;
    }
    ambience.current = startAmbience();
    return () => {
      ambience.current?.stop();
      ambience.current = null;
    };
  }, [state.soundOn]);

  useEffect(() => {
    ambience.current?.setMood(mood);
  }, [mood]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    setTilt({ x, y });
  }, []);

  const launch = (who: "waqas" | "aliem") => {
    if (state.soundOn) playChord(who === "waqas" ? [220, 330, 440] : [330, 494, 659], 0.6);
    setFlyTo(who);
    setTimeout(() => navigate({ to: "/adventure" }), 1100);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* ================= HERO SECTION ================= */}
      <section
        onMouseMove={onMove}
        className="relative isolate flex min-h-[92vh] flex-col overflow-hidden lg:min-h-screen lg:flex-row"
      >
        <CaptainSide
          side="left"
          captainImage={waqas.image}
          captainAlt="Pirate Waqas, captain of The Seven Seas"
          shipImage={sevenSeasShip}
          shipName="The Seven Seas ⛵"
          captainName="Pirate Waqas"
          tagline="A brave pirate captain sailing the ocean in search of fun secrets."
          tilt={tilt}
          active={mood === "pirate"}
          visible={phase >= 4}
          onEnter={() => {
            setMood("pirate");
            if (state.soundOn) playTone(300, 0.08, "triangle", 0.03);
          }}
          onLeave={() => setMood("neutral")}
        >
          <CinematicButton tone="gold" onClick={() => launch("waqas")}>
            Sail with Pirate Waqas! ⚔️
          </CinematicButton>
        </CaptainSide>

        <CaptainSide
          side="right"
          captainImage={aliem.image}
          captainAlt="Captain Aliem, commander of The Neon Voyager"
          shipImage={neonVoyagerShip}
          shipName="The Neon Voyager 🛸"
          captainName="Captain Aliem"
          tagline="A fearless captain sailing a glowing ship into mysterious waters."
          tilt={tilt}
          active={mood === "neon"}
          visible={phase >= 4}
          onEnter={() => {
            setMood("neon");
            if (state.soundOn) playTone(660, 0.08, "sine", 0.03);
          }}
          onLeave={() => setMood("neutral")}
        >
          <CinematicButton tone="neon" onClick={() => launch("aliem")}>
            Sail with Captain Aliem! 🌟
          </CinematicButton>
        </CaptainSide>

        <div
          aria-hidden
          className="anim-pulse-glow pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.9 0.18 90 / 0.8), transparent)",
          }}
        />

        {/* TITLE + COMPASS */}
        <div className="pointer-events-none relative z-20 order-first flex flex-col items-center bg-[oklch(0.08_0.03_250_/_0.65)] px-4 pb-6 pt-12 text-center lg:absolute lg:inset-x-0 lg:top-14 lg:order-none lg:bg-transparent lg:pb-0 lg:pt-0">
          {/* MYSTERY CALLOUT BADGE */}
          <div className="pointer-events-auto mb-2 animate-bounce">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/80 bg-amber-950/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 shadow-lg backdrop-blur-md">
              <Sparkles className="size-4 text-amber-400 animate-spin" />
              <span>✨ A secret treasure is waiting in the ocean! ✨</span>
            </span>
          </div>

          <h1
            className={`font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[0.06em] sm:text-7xl lg:text-8xl ${
              phase >= 2 ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-md"
            }`}
            style={{ transition: "all 1600ms cubic-bezier(.2,.8,.2,1)" }}
          >
            <span className="text-rainbow-gradient drop-shadow-[0_6px_30px_rgba(255,215,0,0.6)]">
              The Sea of Secrets
            </span>
          </h1>

          <div className="mt-2 sm:mt-4">
            <MagicCompass tilt={tilt} charge={mood} visible={phase >= 3} />
          </div>

          <div className="mt-5 sm:mt-7 mb-3">
            {phase >= 3 && (
              <p className="font-[family-name:var(--font-title)] text-xs sm:text-sm tracking-widest text-amber-200 font-bold bg-black/70 px-5 py-2 rounded-full border border-amber-400/40 backdrop-blur-md shadow-xl text-center max-w-xl mx-auto">
                <TypewriterText
                  text="Two ships, two captains, two philosophies, one ocean"
                  speed={35}
                />
              </p>
            )}
          </div>

          {/* QUICK START BUTTON FOR IMMEDIATE PLAY */}
          <div className="pointer-events-auto mt-4 flex flex-col items-center gap-2">
            <button
              onClick={() => launch(mood === "neon" ? "aliem" : "waqas")}
              className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-8 py-3.5 font-[family-name:var(--font-title)] text-sm font-extrabold uppercase tracking-widest text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 glow-gold"
            >
              <Sparkles className="size-5 animate-pulse text-amber-950" />
              <span>🚀 Start Adventure Now!</span>
            </button>
            <span className="text-[0.7rem] uppercase font-bold tracking-widest text-amber-300/80">
              No sign-up needed • Free to play
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-300 bg-amber-950/90 px-3.5 py-1.5 rounded-full border border-amber-500/50 shadow-md flex items-center gap-1.5">
              <span>👤 {state.playerName}</span>
              <span className="opacity-40">•</span>
              {state.started ? (
                <span>
                  Chapter {state.chapter} ({state.completedChapters.length}/5 done) · {state.coins}{" "}
                  coins 🪙
                </span>
              ) : (
                <span>Fresh Start · Ready for Chapter 1 ⛵</span>
              )}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
          <GameMenu visible={phase >= 5} />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 bg-[oklch(0.05_0.01_250)]"
          style={{
            opacity: phase >= 1 ? 0 : 1,
            transition: "opacity 1800ms ease",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            opacity: flyTo ? 1 : 0,
            background:
              flyTo === "aliem"
                ? "radial-gradient(circle at 75% 55%, oklch(0.8 0.17 230), oklch(0.1 0.05 250) 70%)"
                : "radial-gradient(circle at 25% 55%, oklch(0.85 0.14 65), oklch(0.1 0.04 250) 70%)",
            transition: "opacity 1000ms ease",
          }}
        />
      </section>

      {/* CREWS SECTION */}
      <section className="relative border-t-2 border-primary/30 py-20 bg-black/20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Meet the pirate friends" title="Two Great Captains & Crews 👥" />
          <div className="grid gap-10 lg:grid-cols-2">
            {([CREWS.aliem, CREWS.waqas] as const).map((crew) => {
              const members = crew.id === "aliem" ? aliemCrew : waqasCrew;
              return (
                <div
                  key={crew.id}
                  className="surface-deck rounded-2xl p-6 transition-all duration-500 hover:glow-gold border-2"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
                    <div className="min-w-0">
                      <h3
                        className="truncate font-[family-name:var(--font-display)] text-3xl tracking-wide font-bold"
                        style={{ color: crew.color }}
                      >
                        {crew.badge} {crew.name}
                      </h3>
                      <p className="text-sm italic font-medium text-amber-200 mt-1">{crew.motto}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/40">
                      {members.length} friends aboard
                    </span>
                  </div>
                  <div
                    className={`mt-6 grid gap-4 ${members.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
                  >
                    {members.map((m) => (
                      <CharacterCard key={m.id} character={m} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORLD MAP TEASER */}
      <section className="relative border-t-2 border-primary/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="7 fun islands to visit" title="The Living Ocean Map 🗺️" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ISLANDS.slice(0, 6).map((i) => (
              <Link
                key={i.id}
                to="/world"
                className="surface-deck group rounded-xl p-6 transition-all hover:-translate-y-2 hover:glow-neon border-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded">
                    Chapter {i.chapterUnlock}
                  </p>
                  <Sparkles className="size-4 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-wide text-foreground group-hover:text-amber-300 transition-colors">
                  {i.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{i.biome}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ENEMIES SECTION */}
      <section className="relative border-t-2 border-primary/30 py-20 bg-black/20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Watch out on the water" title="Rival Pirates & Threats 🏴‍☠️" />
          <div className="grid gap-6 md:grid-cols-3">
            {ENEMIES.map((e) => (
              <Parchment
                key={e.id}
                className="border-2 border-amber-600/40 hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2 text-red-600">
                  <Skull className="size-6 animate-pulse" />
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-foreground">
                    {e.name}
                  </h3>
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-red-700">
                  {e.role} · Threat Level: {e.threat}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-900 font-medium">
                  {e.description}
                </p>
              </Parchment>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-primary/30 py-12 text-center bg-black/40">
        <p className="flex items-center justify-center gap-2 font-[family-name:var(--font-display)] text-2xl text-gold-gradient">
          <Compass
            className="size-6 text-primary animate-spin"
            style={{ animationDuration: "12s" }}
          />{" "}
          The Sea of Secrets
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] font-bold text-amber-300">
          Aliem · Zoëlena · Waqas · Yumna · Saham
        </p>
      </footer>
    </div>
  );
}
