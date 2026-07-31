import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CHAPTERS } from "./story";
import { ISLANDS } from "./game-data";

export interface ProfileSummary {
  id: string;
  name: string;
  chapter: number;
  coins: number;
  updatedAt: number;
}

export interface GameState {
  playerName: string;
  playerId: string;
  started: boolean;
  chapter: number;
  completedChapters: string[];
  choices: Record<string, string>;
  solved: string[];
  items: string[];
  coins: number;
  upgrades: string[];
  islands: string[];
  achievements: string[];
  trust: { aliem: number; waqas: number };
  soundOn: boolean;
}

const LEGACY_KEY = "lss-save-v1";
const PROFILES_KEY = "lss-profiles-v1";
const ACTIVE_PLAYER_KEY = "lss-active-player";

export const createInitialState = (
  name: string = "Sailor",
  id: string = "sailor-1",
): GameState => ({
  playerName: name,
  playerId: id,
  started: false,
  chapter: 1,
  completedChapters: [],
  choices: {},
  solved: [],
  items: [],
  coins: 20,
  upgrades: [],
  islands: ["saltglass"],
  achievements: [],
  trust: { aliem: 10, waqas: 10 },
  soundOn: false,
});

interface Ctx {
  state: GameState;
  profiles: ProfileSummary[];
  update: (fn: (s: GameState) => GameState) => void;
  reset: () => void;
  startNewGame: () => void;
  loginPlayer: (name: string) => void;
  switchProfile: (id: string) => void;
  addItem: (item: string) => void;
  unlockAchievement: (id: string) => void;
  toast: string | null;
}

const GameContext = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize profiles and state from localStorage
  useEffect(() => {
    try {
      let loadedProfiles: ProfileSummary[] = [];
      const profilesRaw = localStorage.getItem(PROFILES_KEY);

      if (profilesRaw) {
        loadedProfiles = JSON.parse(profilesRaw);
      } else {
        // Migration from legacy key or fresh start
        const legacyRaw = localStorage.getItem(LEGACY_KEY);
        let initialSave = createInitialState("Sailor", "sailor-legacy");
        if (legacyRaw) {
          try {
            initialSave = { ...initialSave, ...JSON.parse(legacyRaw) };
          } catch {
            /* ignore */
          }
        }
        loadedProfiles = [
          {
            id: initialSave.playerId,
            name: initialSave.playerName || "Sailor",
            chapter: initialSave.chapter || 1,
            coins: initialSave.coins || 20,
            updatedAt: Date.now(),
          },
        ];
        localStorage.setItem(PROFILES_KEY, JSON.stringify(loadedProfiles));
        localStorage.setItem(
          `lss-save-player-${initialSave.playerId}`,
          JSON.stringify(initialSave),
        );
      }

      setProfiles(loadedProfiles);

      const activeId =
        localStorage.getItem(ACTIVE_PLAYER_KEY) || loadedProfiles[0]?.id || "sailor-1";
      const playerSaveRaw = localStorage.getItem(`lss-save-player-${activeId}`);

      if (playerSaveRaw) {
        const parsed = JSON.parse(playerSaveRaw);
        setState(derive({ ...createInitialState(parsed.playerName, activeId), ...parsed }));
      } else {
        const foundProf = loadedProfiles.find((p) => p.id === activeId);
        setState(derive(createInitialState(foundProf?.name || "Sailor", activeId)));
      }
    } catch (e) {
      console.error("Save state hydration error:", e);
    }
    setHydrated(true);
  }, []);

  // Save state whenever state or hydrated changes
  useEffect(() => {
    if (!hydrated || !state.playerId) return;
    try {
      localStorage.setItem(`lss-save-player-${state.playerId}`, JSON.stringify(state));
      localStorage.setItem(ACTIVE_PLAYER_KEY, state.playerId);

      // Update profiles summary
      setProfiles((prev) => {
        const existing = prev.filter((p) => p.id !== state.playerId);
        const updatedSummary: ProfileSummary = {
          id: state.playerId,
          name: state.playerName,
          chapter: state.chapter,
          coins: state.coins,
          updatedAt: Date.now(),
        };
        const next = [updatedSummary, ...existing];
        localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
        return next;
      });
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const update = useCallback(
    (fn: (s: GameState) => GameState) => setState((s) => derive(fn(s))),
    [],
  );

  const loginPlayer = useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setProfiles((existing) => {
      const found = existing.find((p) => p.name.toLowerCase() === cleanName.toLowerCase());
      if (found) {
        // Returning player: load their saved data
        const playerSaveRaw = localStorage.getItem(`lss-save-player-${found.id}`);
        if (playerSaveRaw) {
          const parsed = JSON.parse(playerSaveRaw);
          setState(derive({ ...createInitialState(cleanName, found.id), ...parsed }));
        } else {
          setState(derive(createInitialState(cleanName, found.id)));
        }
        localStorage.setItem(ACTIVE_PLAYER_KEY, found.id);
        return existing;
      } else {
        // Brand NEW player: start fresh save file at Chapter 1!
        const newId = `player-${Date.now()}`;
        const freshState = createInitialState(cleanName, newId);
        setState(freshState);
        localStorage.setItem(ACTIVE_PLAYER_KEY, newId);
        localStorage.setItem(`lss-save-player-${newId}`, JSON.stringify(freshState));

        const newSummary: ProfileSummary = {
          id: newId,
          name: cleanName,
          chapter: 1,
          coins: 20,
          updatedAt: Date.now(),
        };
        const updatedProfiles = [newSummary, ...existing];
        localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
        return updatedProfiles;
      }
    });
  }, []);

  const switchProfile = useCallback((id: string) => {
    const playerSaveRaw = localStorage.getItem(`lss-save-player-${id}`);
    if (playerSaveRaw) {
      const parsed = JSON.parse(playerSaveRaw);
      setState(derive({ ...createInitialState(parsed.playerName, id), ...parsed }));
    } else {
      setState(derive(createInitialState("Sailor", id)));
    }
    localStorage.setItem(ACTIVE_PLAYER_KEY, id);
  }, []);

  const startNewGame = useCallback(() => {
    setState((s) => createInitialState(s.playerName, s.playerId));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setState((s) => {
      if (s.achievements.includes(id)) return s;
      setTimeout(() => setToast(`Achievement unlocked — ${id}`), 0);
      return { ...s, achievements: [...s.achievements, id] };
    });
  }, []);

  const addItem = useCallback((item: string) => {
    setState((s) => (s.items.includes(item) ? s : derive({ ...s, items: [...s.items, item] })));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const reset = useCallback(() => {
    setState((s) => createInitialState(s.playerName, s.playerId));
  }, []);

  const value = useMemo(
    () => ({
      state,
      profiles,
      update,
      reset,
      startNewGame,
      loginPlayer,
      switchProfile,
      addItem,
      unlockAchievement,
      toast,
    }),
    [
      state,
      profiles,
      update,
      reset,
      startNewGame,
      loginPlayer,
      switchProfile,
      addItem,
      unlockAchievement,
      toast,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/** Derived unlocks: islands + achievements computed from progress. */
function derive(s: GameState): GameState {
  const done = s.completedChapters.length;
  const islands = new Set(s.islands);
  ISLANDS.forEach((i) => {
    if (i.chapterUnlock <= done + 1) islands.add(i.id);
  });

  const kinds = Object.values(s.choices);
  const allyCount = CHAPTERS.filter((c) =>
    c.choice.options.some((o) => o.id === s.choices[c.id] && o.kind === "ally"),
  ).length;
  const attackCount = CHAPTERS.filter((c) =>
    c.choice.options.some((o) => o.id === s.choices[c.id] && o.kind === "attack"),
  ).length;

  const ach = new Set(s.achievements);
  if (s.started) ach.add("first-sail");
  if (islands.size >= 4) ach.add("cartographer");
  if (["Ancient Key I", "Ancient Key II", "Ancient Key III"].every((k) => s.items.includes(k)))
    ach.add("keymaster");
  if (allyCount >= 2) ach.add("diplomat");
  if (attackCount >= 2) ach.add("storm-runner");
  if (s.trust.aliem >= 50 && s.trust.waqas >= 50) ach.add("bonded");
  if (s.completedChapters.includes("ch5")) ach.add("finale");
  void kinds;

  return { ...s, islands: [...islands], achievements: [...ach] };
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
