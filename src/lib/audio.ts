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

/** Short UI tone — used for buttons, page turns, rewards. */
export function playTone(
  freq = 440,
  duration = 0.12,
  type: OscillatorType = "triangle",
  gain = 0.05,
) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playChord(freqs: number[], duration = 0.5) {
  freqs.forEach((f, i) => setTimeout(() => playTone(f, duration, "sine", 0.045), i * 70));
}

/** Soft looping ocean wash via filtered noise. Returns a stop function. */
export function startOcean() {
  const c = getCtx();
  if (!c) return () => {};
  if (c.state === "suspended") void c.resume();
  const buffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 460;
  const g = c.createGain();
  g.gain.value = 0.05;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain).connect(g.gain);
  src.connect(filter).connect(g).connect(c.destination);
  src.start();
  lfo.start();
  return () => {
    try {
      src.stop();
      lfo.stop();
    } catch {
      /* noop */
    }
  };
}
