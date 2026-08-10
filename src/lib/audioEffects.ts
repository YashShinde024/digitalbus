// Web Audio API Synthesizer for Bus Horn and Travel Ambience

let audioCtx: AudioContext | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;
let isAmbientPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a classic Indian bus dual-tone horn ("peep-peep")
 * using Web Audio API oscillators.
 */
export function playBusHorn() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    masterGain.connect(ctx.destination);

    // Dual-frequency Indian bus horn (F3 # / A3 tone)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = "sawtooth";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(370, now);
    osc2.frequency.setValueAtTime(465, now);

    // Subtle pitch modulation (honk pulse)
    osc1.frequency.exponentialRampToValueAtTime(350, now + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(440, now + 0.5);

    osc1.connect(masterGain);
    osc2.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
  } catch (err) {
    console.warn("AudioContext horn synthesis blocked:", err);
  }
}

/**
 * Generates continuous low-pass brown noise to simulate gentle bus engine/road ambience.
 */
export function startAmbientBus(volume = 0.05) {
  if (isAmbientPlaying) return;
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 3; // 3 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise filter algorithm
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    // Low-pass filter for deep diesel engine rumble
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(volume, ctx.currentTime);

    ambientSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientSource.start(0);
    isAmbientPlaying = true;
  } catch (err) {
    console.warn("Ambient bus synthesis error:", err);
  }
}

export function stopAmbientBus() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch {
      // Ignore cleanup errors
    }
    ambientSource = null;
  }
  isAmbientPlaying = false;
}

export function setAmbientVolume(volume: number) {
  if (ambientGain && audioCtx) {
    ambientGain.gain.setValueAtTime(Math.max(0, Math.min(volume, 0.25)), audioCtx.currentTime);
  }
}
