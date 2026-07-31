import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Lock,
  RotateCcw,
  Swords,
  Compass,
  Handshake,
  Trophy,
  Sparkles,
  Star,
  Award,
  Gift,
  Users,
  Zap,
} from "lucide-react";
import { OceanScene } from "@/components/OceanScene";
import { SiteNav } from "@/components/SiteNav";
import { PirateButton, Parchment, SectionTitle } from "@/components/ui-kit";
import { TypewriterText } from "@/components/TypewriterText";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { CHAPTERS, type ChoiceOption } from "@/lib/story";
import { getCharacter, ACHIEVEMENTS } from "@/lib/game-data";
import { useGame } from "@/lib/game-state";
import { useMultiplayer } from "@/lib/multiplayer";
import { playChord, playTone } from "@/lib/audio";

export const Route = createFileRoute("/adventure")({
  head: () => ({
    meta: [
      { title: "Play Adventure — The Sea of Secrets 🎮" },
      {
        name: "description",
        content:
          "Play the fun pirate story game: five chapters, missions, puzzles, rewards, and one big happy ending!",
      },
      { property: "og:title", content: "Play Adventure — The Sea of Secrets 🎮" },
      {
        property: "og:description",
        content: "Choose your path across seven islands. Every road ends together as friends!",
      },
    ],
  }),
  component: Adventure,
});

type Stage = "intro" | "choice" | "outcome" | "challenge" | "reward";

function Adventure() {
  const { state, update, unlockAchievement } = useGame();
  const { onlinePlayers, coopProgress, triggerCoopAbility, roomName } = useMultiplayer();
  const chapter = CHAPTERS.find((c) => c.number === state.chapter) ?? CHAPTERS[0];
  const done = state.completedChapters.includes(chapter.id);

  const [stage, setStage] = useState<Stage>(done ? "reward" : "intro");
  const [picked, setPicked] = useState<ChoiceOption | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  // Sync state when active chapter or player changes
  useEffect(() => {
    const isCompleted = state.completedChapters.includes(chapter.id);
    setStage(isCompleted ? "reward" : "intro");
    const savedChoiceId = state.choices[chapter.id];
    const savedOpt = chapter.choice.options.find((o) => o.id === savedChoiceId) ?? null;
    setPicked(savedOpt);
    setAnswer(state.solved.includes(chapter.id) ? chapter.challenge.answer : null);
  }, [
    chapter.id,
    chapter.choice.options,
    chapter.challenge.answer,
    state.playerId,
    state.completedChapters,
    state.choices,
    state.solved,
  ]);

  const triggerCelebrate = () => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2600);
  };

  const weather = useMemo(
    () => (["clear", "fog", "storm", "sunset", "storm"] as const)[chapter.number - 1] ?? "clear",
    [chapter.number],
  );

  const beginChapter = () => {
    update((s) => ({ ...s, started: true }));
    unlockAchievement("first-sail");
    setStage("choice");
  };

  const choose = (opt: ChoiceOption) => {
    setPicked(opt);
    if (state.soundOn) playTone(opt.kind === "attack" ? 220 : opt.kind === "ally" ? 620 : 440, 0.2);
    update((s) => ({
      ...s,
      started: true,
      choices: { ...s.choices, [chapter.id]: opt.id },
      items: opt.item && !s.items.includes(opt.item) ? [...s.items, opt.item] : s.items,
      trust: {
        aliem: s.trust.aliem + (opt.trust.aliem ?? 0),
        waqas: s.trust.waqas + (opt.trust.waqas ?? 0),
      },
    }));
    setStage("outcome");
  };

  const submitAnswer = (i: number) => {
    setAnswer(i);
    if (i === chapter.challenge.answer) {
      triggerCelebrate();
      if (state.soundOn) playChord([523, 659, 784]);
      update((s) => ({
        ...s,
        solved: s.solved.includes(chapter.id) ? s.solved : [...s.solved, chapter.id],
      }));
    } else if (state.soundOn) {
      playTone(150, 0.3, "sawtooth");
    }
  };

  const claimReward = () => {
    triggerCelebrate();
    if (state.soundOn) playChord([440, 587, 880]);
    update((s) => {
      const isNewReward = !s.completedChapters.includes(chapter.id);
      const nextChapter = Math.min(CHAPTERS.length, Math.max(s.chapter, chapter.number + 1));
      return {
        ...s,
        completedChapters: isNewReward ? [...s.completedChapters, chapter.id] : s.completedChapters,
        items: s.items.includes(chapter.reward.item) ? s.items : [...s.items, chapter.reward.item],
        coins: isNewReward ? s.coins + chapter.reward.coins : s.coins,
        chapter: nextChapter,
      };
    });
    setStage("reward");
  };

  const goToChapter = (n: number) => {
    update((s) => ({ ...s, chapter: n }));
  };

  const icon = { attack: Swords, explore: Compass, ally: Handshake };
  const progress = Math.round((state.completedChapters.length / CHAPTERS.length) * 100);
  const finished = state.completedChapters.includes("ch5");

  return (
    <div className="min-h-screen">
      <SiteNav />
      <CelebrationOverlay trigger={celebrate} />
      <section className="relative isolate overflow-hidden">
        <OceanScene weather={weather} />
        <div className="relative mx-auto max-w-5xl px-4 py-10">
          {/* Chapter selection buttons */}
          <div className="mb-8 bg-black/40 p-4 rounded-2xl border-2 border-primary/30 backdrop-blur-md">
            <p className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-400" /> Story Progress ({progress}%)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {CHAPTERS.map((c) => {
                const unlocked = c.number <= state.completedChapters.length + 1;
                const complete = state.completedChapters.includes(c.id);
                return (
                  <button
                    key={c.id}
                    disabled={!unlocked}
                    onClick={() => goToChapter(c.number)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-105 ${
                      c.number === chapter.number
                        ? "bg-amber-400 text-black shadow-lg glow-gold border-2 border-white"
                        : complete
                          ? "bg-emerald-600/80 text-white border border-emerald-400"
                          : unlocked
                            ? "bg-secondary/60 text-foreground border border-border hover:bg-secondary"
                            : "bg-black/40 text-muted-foreground/40 border border-border/20"
                    }`}
                  >
                    {complete ? (
                      <Check className="size-4 text-white" />
                    ) : !unlocked ? (
                      <Lock className="size-3" />
                    ) : null}
                    Chapter {c.number}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary/80 border border-amber-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-700 shadow-md"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <SectionTitle
            eyebrow={`Chapter ${chapter.number} · ${chapter.logline}`}
            title={chapter.title}
          />

          {/* MULTIPLAYER CO-OP TEAMWORK BANNER */}
          <div className="mb-6 surface-deck rounded-2xl p-4 border-2 border-cyan-400/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                <Users className="size-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-title)] text-base font-bold text-cyan-200">
                    Live Pirate Squad ({roomName})
                  </span>
                  <span className="text-[0.65rem] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                    👥 {onlinePlayers.length} Active
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Combine crew abilities with connected friends! Team Power Meter:{" "}
                  <strong>{coopProgress}%</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerCoopAbility("Courage Boost")}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black uppercase text-black hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
              >
                <Zap className="size-4 animate-spin" />
                <span>Activate Team Ability!</span>
              </button>
              <a
                href="/multiplayer"
                className="rounded-xl bg-slate-900 border border-amber-400/50 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-all"
              >
                Squad Chat 💬
              </a>
            </div>
          </div>

          {/* CREW ALIVE SQUAD BAR WITH SPEECH BUBBLES */}
          <div className="mb-8 surface-deck rounded-2xl p-4 border-2 border-amber-400/50 backdrop-blur-md">
            <p className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-400 animate-spin" />
              <span>Your Pirate Friends Are Ready To Help!</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  id: "waqas",
                  name: "Waqas",
                  speech:
                    stage === "reward"
                      ? "We did it! Courage wins!"
                      : "Every adventure starts with a big dream!",
                  color: "border-amber-400",
                },
                {
                  id: "aliem",
                  name: "Aliem",
                  speech:
                    stage === "challenge"
                      ? "Logic will solve this puzzle!"
                      : "All ship systems are ready!",
                  color: "border-cyan-400",
                },
                {
                  id: "saham",
                  name: "Saham",
                  speech:
                    stage === "choice"
                      ? "I made a 3-step master plan!"
                      : "Don't forget to check for extra coins!",
                  color: "border-yellow-400",
                },
                {
                  id: "zoelena",
                  name: "Zoëlena",
                  speech: "I can decode any hidden ocean secret!",
                  color: "border-blue-400",
                },
                {
                  id: "yumna",
                  name: "Yumna",
                  speech: "The stars light our path across the water!",
                  color: "border-purple-400",
                },
              ].map((member) => {
                const char = getCharacter(
                  member.id as "waqas" | "aliem" | "saham" | "zoelena" | "yumna",
                );
                return (
                  <div
                    key={member.id}
                    className="flex flex-col items-center text-center p-2 rounded-xl bg-black/40 border border-amber-500/20 hover:border-amber-400 transition-all hover:scale-105 group"
                  >
                    <div
                      className={`relative size-12 rounded-full overflow-hidden border-2 ${member.color} shadow-md`}
                    >
                      <img
                        src={char.image}
                        alt={member.name}
                        className="size-full object-cover object-top group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="mt-1 text-xs font-extrabold text-foreground">
                      {member.name}
                    </span>
                    <p className="mt-1 text-[0.65rem] italic text-amber-200/90 leading-tight bg-amber-950/70 p-1 rounded border border-amber-500/30 w-full">
                      "{member.speech}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MYSTERY DISCOVERY BOX */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border-2 border-amber-400/60 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <Gift className="size-7 text-amber-400 animate-bounce" />
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                  Island Secret Mystery
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  {chapter.reward.item} awaits!
                </p>
              </div>
            </div>
            <div className="bg-amber-400 text-black px-3.5 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
              <span>🪙 Reward: +{chapter.reward.coins} Coins</span>
            </div>
          </div>

          {/* INTRO STAGE */}
          {stage === "intro" && (
            <Parchment className="animate-pop-in border-2 border-amber-600/50 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="size-4 text-amber-600" /> Story Beginning
              </div>
              <div className="mt-4 text-xl leading-relaxed text-slate-900 font-medium">
                <TypewriterText text={chapter.intro} speed={20} />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <PirateButton onClick={beginChapter}>Start Mission! 🚀</PirateButton>
                <PirateButton to="/comic" variant="ghost">
                  Read Comic 📖
                </PirateButton>
              </div>
            </Parchment>
          )}

          {/* CHOICE STAGE */}
          {stage === "choice" && (
            <div className="animate-pop-in">
              <div className="mb-6 p-5 rounded-xl bg-black/60 border-2 border-amber-400/50 backdrop-blur-md">
                <p className="font-[family-name:var(--font-title)] text-xl font-bold text-amber-300">
                  {chapter.choice.prompt}
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {chapter.choice.options.map((o) => {
                  const Icon = icon[o.kind];
                  return (
                    <button
                      key={o.id}
                      onClick={() => choose(o)}
                      className="surface-deck group rounded-2xl p-6 text-left transition-all transform hover:-translate-y-2 hover:glow-gold border-2 hover:border-amber-400"
                    >
                      <div className="p-3 rounded-xl bg-primary/20 text-primary inline-block group-hover:scale-110 transition-transform">
                        <Icon className="size-7" />
                      </div>
                      <p className="mt-4 font-[family-name:var(--font-title)] text-base font-bold leading-snug text-foreground group-hover:text-amber-300">
                        {o.label}
                      </p>
                      <span className="mt-3 inline-block rounded-full bg-secondary/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {o.kind === "attack"
                          ? "⚡ Bold Path"
                          : o.kind === "explore"
                            ? "🔍 Search Path"
                            : "🤝 Friendly Path"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* OUTCOME STAGE */}
          {stage === "outcome" && picked && (
            <Parchment className="animate-pop-in border-2 border-amber-600/50">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="size-4 text-amber-600" /> What Happened Next
              </div>
              <p className="mt-4 text-xl leading-relaxed text-slate-900 font-medium">
                {picked.outcome}
              </p>
              {picked.item && (
                <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-500 rounded-lg px-4 py-2 text-amber-950 font-bold text-base">
                  <Gift className="size-5 text-amber-600 animate-bounce" /> Item Found:{" "}
                  {picked.item}
                </div>
              )}
              <div className="mt-6">
                <PirateButton onClick={() => setStage("challenge")}>
                  Solve the Puzzle! 🧩
                </PirateButton>
              </div>
            </Parchment>
          )}

          {/* CHALLENGE STAGE */}
          {stage === "challenge" && (
            <div className="animate-pop-in">
              <Parchment className="border-2 border-amber-600/50">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-widest">
                  <Star className="size-4 text-amber-600" /> Puzzle Time
                </div>
                <p className="mt-3 text-xl font-bold text-slate-900">{chapter.challenge.prompt}</p>
                <p className="mt-2 text-base italic font-semibold text-amber-800 bg-amber-100/80 p-3 rounded-lg border border-amber-300">
                  Hint: {chapter.challenge.clue}
                </p>
              </Parchment>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {chapter.challenge.options.map((opt, i) => {
                  const chosen = answer === i;
                  const correct = i === chapter.challenge.answer;
                  return (
                    <button
                      key={opt}
                      disabled={answer !== null}
                      onClick={() => submitAnswer(i)}
                      className={`rounded-2xl p-5 text-left text-base font-bold transition-all transform disabled:cursor-default ${
                        answer === null
                          ? "bg-slate-900/90 text-white border-2 border-amber-400/40 hover:-translate-y-1 hover:border-amber-400 hover:glow-gold"
                          : correct
                            ? "bg-emerald-600 text-white border-2 border-white scale-105 shadow-xl"
                            : chosen
                              ? "bg-red-600 text-white border-2 border-white"
                              : "bg-slate-800/40 text-gray-400 border border-gray-700 opacity-40"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answer !== null && (
                <Parchment className="mt-5 border-2 border-amber-600/50">
                  <p className="text-lg font-bold text-slate-900 leading-relaxed">
                    {answer === chapter.challenge.answer
                      ? chapter.challenge.onSolve
                      : chapter.challenge.onFail}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {answer !== chapter.challenge.answer && (
                      <PirateButton variant="ghost" onClick={() => setAnswer(null)}>
                        <RotateCcw className="size-4" /> Try Again
                      </PirateButton>
                    )}
                    <PirateButton onClick={claimReward}>Claim Reward! 🎁</PirateButton>
                  </div>
                </Parchment>
              )}
            </div>
          )}

          {/* REWARD STAGE */}
          {stage === "reward" && (
            <div className="animate-pop-in">
              <Parchment className="border-2 border-amber-600/50 text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-500 rounded-full px-4 py-1 text-emerald-900 font-bold text-xs uppercase tracking-widest mb-2">
                  <Award className="size-4 text-emerald-600" /> Chapter Completed!
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-amber-950 font-bold">
                  {chapter.reward.item}
                </h3>
                <p className="mt-2 text-lg font-bold text-amber-800">
                  +{chapter.reward.coins} Pirate Coins 🪙
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {chapter.number < CHAPTERS.length ? (
                    <PirateButton onClick={() => goToChapter(chapter.number + 1)}>
                      Next Chapter {chapter.number + 1} ⛵
                    </PirateButton>
                  ) : (
                    <PirateButton to="/comic">Watch Final Comic Ending! 🎬</PirateButton>
                  )}
                  <PirateButton to="/inventory" variant="ghost">
                    Open Treasure Bag 💎
                  </PirateButton>
                  <PirateButton
                    variant="ghost"
                    onClick={() => {
                      setPicked(null);
                      setAnswer(null);
                      setStage("intro");
                    }}
                  >
                    <RotateCcw className="size-4" /> Replay Chapter
                  </PirateButton>
                </div>
              </Parchment>

              {finished && chapter.number === CHAPTERS.length && (
                <Parchment className="mt-6 border-2 border-amber-500 bg-amber-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                    A Happy Ending Together!
                  </p>
                  <p className="mt-3 text-lg leading-relaxed text-slate-900 font-medium">
                    No matter which road you took — bold, curious, or peaceful — both crews arrived
                    at the same door together. The Lost Sea Secret is the map to new adventures and
                    the friendship between two great captains!
                  </p>
                </Parchment>
              )}
            </div>
          )}

          {/* TRUST + ACHIEVEMENTS */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="surface-deck rounded-2xl p-6 border-2 border-amber-400/40">
              <h4 className="font-[family-name:var(--font-title)] text-base font-bold uppercase tracking-wider text-amber-300">
                Captain Friendship Level
              </h4>
              {(["aliem", "waqas"] as const).map((id) => (
                <div key={id} className="mt-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-200">
                    <span>{getCharacter(id).name}</span>
                    <span className="text-amber-300">{Math.min(100, state.trust[id])}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary border border-amber-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-700"
                      style={{ width: `${Math.min(100, state.trust[id])}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-deck rounded-2xl p-6 border-2 border-amber-400/40">
              <h4 className="flex items-center gap-2 font-[family-name:var(--font-title)] text-base font-bold uppercase tracking-wider text-amber-300">
                <Trophy className="size-5 text-amber-400" /> Trophies & Badges
              </h4>
              <ul className="mt-4 space-y-2 text-xs font-bold">
                {ACHIEVEMENTS.map((a) => {
                  const got = state.achievements.includes(a.id);
                  return (
                    <li
                      key={a.id}
                      className={
                        got
                          ? "text-amber-300 flex items-center gap-1.5"
                          : "text-muted-foreground/60 flex items-center gap-1.5"
                      }
                    >
                      <span className="text-sm">{got ? "⭐" : "☆"}</span>
                      <span>{a.name}</span> —{" "}
                      <span className="font-normal opacity-80">{a.detail}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
