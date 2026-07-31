import { useEffect, useState } from "react";

interface Particle {
  id: number;
  icon: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

const EMOJIS = ["✨", "🌟", "💖", "🫧", "🌊", "💎", "⭐", "💫", "⛵", "🐚"];

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      size: Math.random() * 1.2 + 0.8, // 0.8rem to 2rem
      duration: Math.random() * 8 + 8, // 8s to 16s
      delay: Math.random() * 5,
    }));
    setParticles(items);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float-particle opacity-70 hover:opacity-100 transition-opacity"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: "drop-shadow(0 0 8px rgba(255,215,0,0.5))",
          }}
        >
          {p.icon}
        </div>
      ))}
    </div>
  );
}
