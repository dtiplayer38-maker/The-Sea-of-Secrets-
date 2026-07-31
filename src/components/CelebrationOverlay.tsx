import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

const CELEBRATION_EMOJIS = ["⭐", "✨", "🪙", "💎", "💖", "🎉", "🏆", "🌊"];

export function CelebrationOverlay({ trigger }: { trigger: boolean }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const items: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + Date.now(),
      x: 10 + Math.random() * 80, // %
      y: 20 + Math.random() * 60, // %
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      size: Math.random() * 1.5 + 1.2, // rem
    }));

    setSparkles(items);
    const timer = setTimeout(() => setSparkles([]), 2500);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (sparkles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-pop-in"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}rem`,
            filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
          }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  );
}
