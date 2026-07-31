/** Layered adaptive ambience: ocean wash + wind + orchestral pad + neon shimmer. */

let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export type AmbienceMood = "neutral" | "pirate" | "neon";

export interface AmbienceHandle {
  setMood: (mood: AmbienceMood) => void;
  stop: () => void;
}

function noiseBuffer(c: AudioContext, seconds = 3) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Starts the full ambience bed. Returns null when audio is unavailable. */
export function startAmbience(): AmbienceHandle | null {
  const c = getCtx();
  if (!c) return null;
  if (c.state === "suspended") void c.resume();

  const master = c.createGain();
  master.gain.value = 0;
  master.connect(c.destination);
  master.gain.linearRampToValueAtTime(0.9, c.currentTime + 3);

  // --- ocean wash ---
  const surf = c.createBufferSource();
  surf.buffer = noiseBuffer(c);
  surf.loop = true;
  const surfFilter = c.createBiquadFilter();
  surfFilter.type = "lowpass";
  surfFilter.frequency.value = 480;
  const surfGain = c.createGain();
  surfGain.gain.value = 0.05;
  const swell = c.createOscillator();
  const swellGain = c.createGain();
  swell.frequency.value = 0.11;
  swellGain.gain.value = 0.03;
  swell.connect(swellGain).connect(surfGain.gain);
  surf.connect(surfFilter).connect(surfGain).connect(master);

  // --- wind ---
  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c, 4);
  wind.loop = true;
  const windFilter = c.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 900;
  windFilter.Q.value = 0.7;
  const windGain = c.createGain();
  windGain.gain.value = 0.012;
  const gust = c.createOscillator();
  const gustGain = c.createGain();
  gust.frequency.value = 0.05;
  gustGain.gain.value = 0.01;
  gust.connect(gustGain).connect(windGain.gain);
  wind.connect(windFilter).connect(windGain).connect(master);

  // --- orchestral pad (pirate) ---
  const padGain = c.createGain();
  padGain.gain.value = 0.05;
  padGain.connect(master);
  const padOscs = [110, 164.81, 220, 329.63].map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? "triangle" : "sawtooth";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = i === 3 ? 0.012 : 0.03;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    o.connect(g).connect(lp).connect(padGain);
    o.start();
    return o;
  });

  // --- neon shimmer (futuristic) ---
  const neonGain = c.createGain();
  neonGain.gain.value = 0.0;
  neonGain.connect(master);
  const neonOscs = [261.63, 392, 523.25, 784].map((f) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.016;
    const trem = c.createOscillator();
    const tremGain = c.createGain();
    trem.frequency.value = 0.4 + Math.random() * 0.5;
    tremGain.gain.value = 0.012;
    trem.connect(tremGain).connect(g.gain);
    trem.start();
    o.connect(g).connect(neonGain);
    o.start();
    return { o, trem };
  });

  surf.start();
  wind.start();
  swell.start();
  gust.start();

  const setMood = (mood: AmbienceMood) => {
    const t = c.currentTime;
    const pad = mood === "neon" ? 0.02 : mood === "pirate" ? 0.09 : 0.05;
    const neon = mood === "neon" ? 0.085 : mood === "pirate" ? 0.0 : 0.02;
    const surfLevel = mood === "pirate" ? 0.07 : 0.045;
    padGain.gain.linearRampToValueAtTime(pad, t + 1.1);
    neonGain.gain.linearRampToValueAtTime(neon, t + 1.1);
    surfGain.gain.linearRampToValueAtTime(surfLevel, t + 1.1);
    surfFilter.frequency.linearRampToValueAtTime(mood === "neon" ? 700 : 460, t + 1.1);
  };

  const stop = () => {
    const t = c.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.6);
    setTimeout(() => {
      try {
        surf.stop();
        wind.stop();
        swell.stop();
        gust.stop();
        padOscs.forEach((o) => o.stop());
        neonOscs.forEach(({ o, trem }) => {
          o.stop();
          trem.stop();
        });
        master.disconnect();
      } catch {
        /* noop */
      }
    }, 700);
  };

  return { setMood, stop };
}
