// Web Audio API Sound Synthesizer Utility

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Play a synthesized note
const playTone = (frequency: number, type: OscillatorType, duration: number, startTime: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security autoplays)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Smooth gain envelope to avoid clicking sounds
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

// Play positive success chime (two short notes ascending)
export const playCorrectSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // C5 (523.25 Hz) then E5 (659.25 Hz)
  playTone(523.25, "sine", 0.1, now);
  playTone(659.25, "sine", 0.25, now + 0.08);
};

// Play negative buzzer sound (sliding down buzzer tone)
export const playIncorrectSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.35);
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.35);
};

// Play lesson completed fanfare (ascending major chord)
export const playCompleteSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // C4, E4, G4, C5 major arpeggio
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, idx) => {
    playTone(freq, "triangle", 0.3, now + idx * 0.12);
  });
};
