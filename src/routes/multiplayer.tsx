import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  MessageSquare,
  Sparkles,
  Shield,
  Send,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import { useGame } from "../lib/game-state";
import { useMultiplayer, QUICK_MESSAGES, EMOTES } from "../lib/multiplayer";
import { getCharacter } from "../lib/game-data";

export const Route = createFileRoute("/multiplayer")({
  component: MultiplayerRoute,
});

export function MultiplayerRoute() {
  const { state } = useGame();
  const {
    roomId,
    roomName,
    setRoomId,
    onlinePlayers,
    messages,
    coopProgress,
    lastCoopAction,
    sendMessage,
    sendEmote,
    triggerCoopAbility,
    chatMuted,
    toggleChatMuted,
  } = useMultiplayer();

  const [inputRoom, setInputRoom] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [showQuickMsg, setShowQuickMsg] = useState(true);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      setRoomId(inputRoom.trim().toLowerCase());
      setInputRoom("");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.03_250)] text-foreground flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* HEADER HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl surface-deck p-6 sm:p-8 border-2 border-amber-400/60 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 size-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/80 bg-amber-950/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 mb-3">
                <Users className="size-4 text-amber-400 animate-pulse" />
                <span>Multiplayer Pirate Squad</span>
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl tracking-wide text-gradient-gold">
                Pirate Cove Lounge
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-xl">
                Sail the Sea of Secrets together! Chat with pirate friends, combine character
                powers, and unlock secret co-op treasure chests!
              </p>
            </div>

            {/* ROOM SELECTOR BOX */}
            <div className="bg-black/60 p-4 rounded-2xl border border-amber-500/40 backdrop-blur-md min-w-[280px]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                <span>Current Room:</span>
                <span className="text-white bg-amber-500/30 px-2 py-0.5 rounded border border-amber-400/40">
                  {roomName}
                </span>
              </div>
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Room Code (e.g. PIRATE-1)"
                  value={inputRoom}
                  onChange={(e) => setInputRoom(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-xs font-extrabold uppercase text-black hover:scale-105 transition-transform"
                >
                  Join
                </button>
              </form>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["default-bay", "neon-fleet", "treasure-cove"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoomId(r)}
                    className={`text-[0.65rem] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      roomId === r
                        ? "bg-amber-400 text-black border-amber-300"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400"
                    }`}
                  >
                    #{r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CO-OP TEAMWORK POWER METER */}
        <div className="surface-deck rounded-2xl p-6 border-2 border-cyan-400/50 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="size-6 text-cyan-400 animate-spin" />
                <h2 className="font-[family-name:var(--font-title)] text-xl font-bold text-cyan-200">
                  Teamwork Power Challenge
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Combine your crew abilities! When the team power meter reaches 100%, everyone in the
                room gets <strong>+50 Bonus Coins</strong>!
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-cyan-300">{coopProgress}%</span>
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">
                Co-op Power Level
              </span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="relative h-6 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/40 p-0.5 mb-4">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-amber-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${coopProgress}%` }}
            >
              {coopProgress > 0 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>

          {lastCoopAction && (
            <div className="text-xs italic text-amber-300 mb-4 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30">
              ⚡ <strong>{lastCoopAction.playerName}</strong> used ability{" "}
              <strong>{lastCoopAction.abilityName}</strong>! (+25% Team Power)
            </div>
          )}

          {/* ABILITY BUTTONS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              {
                id: "waqas",
                name: "Waqas",
                ability: "Courage Cannon",
                color: "from-amber-500 to-red-600",
              },
              {
                id: "aliem",
                name: "Aliem",
                ability: "Logic Scanner",
                color: "from-cyan-500 to-blue-600",
              },
              {
                id: "saham",
                name: "Saham",
                ability: "Tactical Shield",
                color: "from-yellow-400 to-amber-600",
              },
              {
                id: "zoelena",
                name: "Zoëlena",
                ability: "Mystic Decode",
                color: "from-purple-500 to-indigo-600",
              },
              {
                id: "yumna",
                name: "Yumna",
                ability: "Star Navigation",
                color: "from-pink-500 to-purple-600",
              },
            ].map((hero) => {
              const char = getCharacter(
                hero.id as "waqas" | "aliem" | "saham" | "zoelena" | "yumna",
              );
              return (
                <button
                  key={hero.id}
                  onClick={() => triggerCoopAbility(hero.ability)}
                  className={`flex flex-col items-center p-2.5 rounded-xl bg-gradient-to-b ${hero.color} text-white shadow-lg hover:scale-105 active:scale-95 transition-all group`}
                >
                  <div className="size-10 rounded-full border-2 border-white/80 overflow-hidden mb-1">
                    <img
                      src={char.image}
                      alt={hero.name}
                      className="size-full object-cover object-top"
                    />
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-wider">
                    {hero.name}
                  </span>
                  <span className="text-[0.6rem] font-bold opacity-90">{hero.ability}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN GRID: PLAYERS + CHAT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ONLINE PLAYERS SIDEBAR */}
          <div className="space-y-4">
            <div className="surface-deck rounded-2xl p-5 border-2 border-amber-500/40">
              <h2 className="font-[family-name:var(--font-title)] text-lg font-bold text-amber-300 flex items-center justify-between mb-4">
                <span className="flex items-center gap-2">
                  <Users className="size-5 text-amber-400" />
                  <span>Connected Pirates</span>
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {onlinePlayers.length} Online
                </span>
              </h2>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {onlinePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-amber-400/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl">
                        {player.avatar}
                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white">{player.name}</span>
                          {player.id === state.playerId && (
                            <span className="text-[0.6rem] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-amber-300/80 flex items-center gap-1">
                          <Compass className="size-3" /> Ch. {player.chapter} • {player.coins} 🪙
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAFETY NOTICE CARD */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <Shield className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 mb-0.5">Friendly Censor Active</strong>
                Chat is filtered for friendly speech. Be nice to fellow pirates on the adventure!
              </div>
            </div>
          </div>

          {/* CHAT LOUNGE */}
          <div className="lg:col-span-2 surface-deck rounded-2xl p-6 border-2 border-amber-500/40 flex flex-col h-[600px]">
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-amber-400" />
                <h2 className="font-[family-name:var(--font-title)] text-lg font-bold text-amber-300">
                  Squad Live Chat
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleChatMuted}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                  title={chatMuted ? "Unmute Chat" : "Mute Chat"}
                >
                  {chatMuted ? (
                    <VolumeX className="size-4 text-red-400" />
                  ) : (
                    <Volume2 className="size-4 text-emerald-400" />
                  )}
                </button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {chatMuted ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <VolumeX className="size-10 mb-2 opacity-50 text-red-400" />
                  <p>Chat is currently muted by you.</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <Sparkles className="size-10 mb-2 opacity-50 text-amber-400 animate-pulse" />
                  <p>No messages yet! Be the first pirate to say ahoy!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === state.playerId;
                  const isSystem = msg.senderId === "system";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isSystem ? "items-center" : isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {isSystem ? (
                        <div className="my-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[0.7rem] text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
                          <span>{msg.senderAvatar}</span>
                          <span>{msg.text}</span>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                            isMe
                              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-tr-none"
                              : "bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase mb-1 opacity-80">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* EMOTE QUICK BAR */}
            <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[0.65rem] uppercase font-bold text-amber-300/80 mr-1 shrink-0">
                Reaction:
              </span>
              {EMOTES.map((emo) => (
                <button
                  key={emo}
                  onClick={() => sendEmote(emo)}
                  className="size-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-base flex items-center justify-center transition-transform hover:scale-125 active:scale-95"
                >
                  {emo}
                </button>
              ))}
            </div>

            {/* QUICK MESSAGES DRAWER */}
            {showQuickMsg && (
              <div className="mb-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap gap-1.5">
                {QUICK_MESSAGES.map((qm) => (
                  <button
                    key={qm}
                    onClick={() => sendMessage(qm, true)}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-amber-200 border border-slate-700 hover:border-amber-400 hover:bg-amber-950 transition-colors"
                  >
                    {qm}
                  </button>
                ))}
              </div>
            )}

            {/* CHAT INPUT FORM */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                placeholder="Type a friendly message to the crew..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatMuted}
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chatMuted || !chatInput.trim()}
                className="rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-5 py-3 text-sm font-extrabold text-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="size-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
