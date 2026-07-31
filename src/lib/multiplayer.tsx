import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGame } from "./game-state";
import { playTone, playChord } from "./audio";

export interface OnlinePlayer {
  id: string;
  name: string;
  avatar: string;
  character: string;
  chapter: number;
  coins: number;
  island: string;
  lastActive: number;
  activeEmote?: string;
  coopAbility?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isQuickMsg?: boolean;
}

export interface RoomState {
  roomId: string;
  roomName: string;
  players: Record<string, OnlinePlayer>;
  messages: ChatMessage[];
  coopProgress: number;
  lastCoopAction?: {
    playerName: string;
    abilityName: string;
    timestamp: number;
  };
}

const BAD_WORDS = ["badword", "hate", "dumb", "stupid", "fool"];

export function censorText(text: string): string {
  let clean = text;
  BAD_WORDS.forEach((word) => {
    const reg = new RegExp(word, "gi");
    clean = clean.replace(reg, "***");
  });
  return clean;
}

export const QUICK_MESSAGES = [
  "Ahoy, crew! ⛵",
  "Ready to sail together! 🌊",
  "I found a secret key! 🗝️",
  "Need help with this puzzle! 🧩",
  "Great teamwork! 🏆",
  "Let me scan the island! 🧠",
  "Courage power ready! ⚔️",
  "High five! ✋",
];

export const EMOTES = ["⛵", "⚔️", "💎", "🚀", "✨", "🏴‍☠️", "⚓", "👑", "🧠", "🔥"];

interface MultiplayerCtx {
  roomId: string;
  roomName: string;
  setRoomId: (id: string) => void;
  onlinePlayers: OnlinePlayer[];
  messages: ChatMessage[];
  coopProgress: number;
  lastCoopAction?: { playerName: string; abilityName: string; timestamp: number };
  sendMessage: (text: string, isQuickMsg?: boolean) => void;
  sendEmote: (emote: string) => void;
  triggerCoopAbility: (abilityName: string) => void;
  resetCoopMeter: () => void;
  floatingEmotes: { id: string; senderName: string; emote: string }[];
  chatMuted: boolean;
  toggleChatMuted: () => void;
}

const MultiplayerContext = createContext<MultiplayerCtx | null>(null);

export function MultiplayerProvider({ children }: { children: ReactNode }) {
  const { state, update } = useGame();
  const [roomId, setRoomId] = useState("default-bay");
  const [roomState, setRoomState] = useState<RoomState>({
    roomId: "default-bay",
    roomName: "Public Pirate Bay",
    players: {},
    messages: [],
    coopProgress: 0,
  });
  const [floatingEmotes, setFloatingEmotes] = useState<
    { id: string; senderName: string; emote: string }[]
  >([]);
  const [chatMuted, setChatMuted] = useState(false);

  // Derive player details
  const myPlayerInfo: OnlinePlayer = useMemo(
    () => ({
      id: state.playerId,
      name: state.playerName,
      avatar: "🏴‍☠️",
      character: "Sailor",
      chapter: state.chapter,
      coins: state.coins,
      island: state.islands[state.islands.length - 1] || "saltglass",
      lastActive: Date.now(),
    }),
    [state.playerId, state.playerName, state.chapter, state.coins, state.islands],
  );

  // Sync state with server API
  const syncWithServer = useCallback(async () => {
    try {
      // Send Heartbeat / Sync
      const res = await fetch("/api/multiplayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "heartbeat",
          roomId,
          player: myPlayerInfo,
        }),
      });
      if (res.ok) {
        const data: RoomState = await res.json();
        setRoomState(data);
      }
    } catch {
      // Fallback local mock mode
    }
  }, [roomId, myPlayerInfo]);

  // Periodic heartbeat every 3 seconds
  useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 3000);
    return () => clearInterval(interval);
  }, [syncWithServer]);

  // BroadcastChannel for instant local multi-tab real-time sync
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("lss-multiplayer");

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data || data.roomId !== roomId) return;

      if (data.type === "chat") {
        setRoomState((prev) => ({
          ...prev,
          messages: [...prev.messages.slice(-49), data.message],
        }));
      } else if (data.type === "emote") {
        const newEmote = {
          id: `${Date.now()}-${Math.random()}`,
          senderName: data.senderName,
          emote: data.emote,
        };
        setFloatingEmotes((prev) => [...prev, newEmote]);
        setTimeout(() => {
          setFloatingEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
        }, 3000);
      } else if (data.type === "coop") {
        setRoomState((prev) => ({
          ...prev,
          coopProgress: Math.min(100, prev.coopProgress + (data.boost || 25)),
          lastCoopAction: {
            playerName: data.playerName,
            abilityName: data.abilityName,
            timestamp: Date.now(),
          },
        }));
      }
    };

    return () => channel.close();
  }, [roomId]);

  const sendMessage = useCallback(
    async (text: string, isQuickMsg = false) => {
      const cleanText = censorText(text.trim());
      if (!cleanText) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderId: state.playerId,
        senderName: state.playerName,
        senderAvatar: "🏴‍☠️",
        text: cleanText,
        timestamp: Date.now(),
        isQuickMsg,
      };

      if (state.soundOn) playTone(700, 0.08);

      // Broadcast locally
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("lss-multiplayer");
        channel.postMessage({ type: "chat", roomId, message: newMsg });
        channel.close();
      }

      // Optimistic update
      setRoomState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(-49), newMsg],
      }));

      // Server post
      try {
        await fetch("/api/multiplayer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            roomId,
            message: newMsg,
          }),
        });
      } catch {
        /* ignore */
      }
    },
    [roomId, state.playerId, state.playerName, state.soundOn],
  );

  const sendEmote = useCallback(
    (emote: string) => {
      const newEmote = {
        id: `${Date.now()}-${Math.random()}`,
        senderName: state.playerName,
        emote,
      };
      setFloatingEmotes((prev) => [...prev, newEmote]);
      setTimeout(() => {
        setFloatingEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
      }, 3000);

      if (state.soundOn) playTone(880, 0.1);

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("lss-multiplayer");
        channel.postMessage({ type: "emote", roomId, senderName: state.playerName, emote });
        channel.close();
      }
    },
    [roomId, state.playerName, state.soundOn],
  );

  const triggerCoopAbility = useCallback(
    async (abilityName: string) => {
      if (state.soundOn) playChord([523, 659, 784, 1046]);

      // Broadcast locally
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("lss-multiplayer");
        channel.postMessage({
          type: "coop",
          roomId,
          playerName: state.playerName,
          abilityName,
          boost: 25,
        });
        channel.close();
      }

      setRoomState((prev) => {
        const newProgress = Math.min(100, prev.coopProgress + 25);
        if (newProgress >= 100) {
          // Award team bonus!
          update((s) => ({
            ...s,
            coins: s.coins + 50,
            achievements: s.achievements.includes("coop-captain")
              ? s.achievements
              : [...s.achievements, "coop-captain"],
          }));
        }
        return {
          ...prev,
          coopProgress: newProgress,
          lastCoopAction: {
            playerName: state.playerName,
            abilityName,
            timestamp: Date.now(),
          },
        };
      });

      try {
        await fetch("/api/multiplayer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "coop_ability",
            roomId,
            playerName: state.playerName,
            abilityName,
            boost: 25,
          }),
        });
      } catch {
        /* ignore */
      }
    },
    [roomId, state.playerName, state.soundOn, update],
  );

  const resetCoopMeter = useCallback(async () => {
    setRoomState((prev) => ({ ...prev, coopProgress: 0 }));
    try {
      await fetch("/api/multiplayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_coop", roomId }),
      });
    } catch {
      /* ignore */
    }
  }, [roomId]);

  const toggleChatMuted = useCallback(() => {
    setChatMuted((prev) => !prev);
  }, []);

  const onlinePlayers = useMemo(() => {
    const playersList = Object.values(roomState.players);
    // Ensure current player is included
    if (!playersList.some((p) => p.id === state.playerId)) {
      return [myPlayerInfo, ...playersList];
    }
    return playersList;
  }, [roomState.players, myPlayerInfo, state.playerId]);

  const value = useMemo(
    () => ({
      roomId,
      roomName: roomState.roomName || "Public Pirate Bay",
      setRoomId,
      onlinePlayers,
      messages: roomState.messages || [],
      coopProgress: roomState.coopProgress || 0,
      lastCoopAction: roomState.lastCoopAction,
      sendMessage,
      sendEmote,
      triggerCoopAbility,
      resetCoopMeter,
      floatingEmotes,
      chatMuted,
      toggleChatMuted,
    }),
    [
      roomId,
      roomState.roomName,
      roomState.messages,
      roomState.coopProgress,
      roomState.lastCoopAction,
      onlinePlayers,
      sendMessage,
      sendEmote,
      triggerCoopAbility,
      resetCoopMeter,
      floatingEmotes,
      chatMuted,
      toggleChatMuted,
    ],
  );

  return (
    <MultiplayerContext.Provider value={value}>
      {children}

      {/* FLOATING EMOTE ANIMATIONS ON SCREEN */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {floatingEmotes.map((e) => (
          <div
            key={e.id}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce-slow flex flex-col items-center bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-400 text-white shadow-2xl"
            style={{
              animation: "floatUp 2.8s ease-out forwards",
            }}
          >
            <span className="text-3xl animate-spin">{e.emote}</span>
            <span className="text-[0.65rem] font-bold text-amber-300 uppercase tracking-widest mt-0.5">
              {e.senderName}
            </span>
          </div>
        ))}
      </div>
    </MultiplayerContext.Provider>
  );
}

export function useMultiplayer() {
  const ctx = useContext(MultiplayerContext);
  if (!ctx) throw new Error("useMultiplayer must be used within MultiplayerProvider");
  return ctx;
}
