/**
 * Programmatic Web Audio Synthesizer
 * Provides an automatic looping acoustic music-box melody of "Happy Birthday To You",
 * cake slicing sound, and candle wind whoosh.
 * Works seamlessly in all modern browsers without requiring external audio downloads.
 */

interface Note {
  pitch: number; // frequency in Hz
  duration: number; // in beats
}

// "Happy Birthday to You" notes (Key of F / C for soft, romantic music box chime)
const NOTE_C4 = 261.63;
const NOTE_D4 = 293.66;
const NOTE_E4 = 329.63;
const NOTE_F4 = 349.23;
const NOTE_G4 = 392.00;
const NOTE_A4 = 440.00;
const NOTE_Bb4 = 466.16;
const NOTE_C5 = 523.25;
const NOTE_F5 = 698.46;

const HAPPY_BIRTHDAY_MELODY: Note[] = [
  // Happy Birthday to you
  { pitch: NOTE_C4, duration: 0.75 },
  { pitch: NOTE_C4, duration: 0.25 },
  { pitch: NOTE_D4, duration: 1.0 },
  { pitch: NOTE_C4, duration: 1.0 },
  { pitch: NOTE_F4, duration: 1.0 },
  { pitch: NOTE_E4, duration: 2.0 },

  // Happy Birthday to you
  { pitch: NOTE_C4, duration: 0.75 },
  { pitch: NOTE_C4, duration: 0.25 },
  { pitch: NOTE_D4, duration: 1.0 },
  { pitch: NOTE_C4, duration: 1.0 },
  { pitch: NOTE_G4, duration: 1.0 },
  { pitch: NOTE_F4, duration: 2.0 },

  // Happy Birthday dear Alisha
  { pitch: NOTE_C4, duration: 0.75 },
  { pitch: NOTE_C4, duration: 0.25 },
  { pitch: NOTE_C5, duration: 1.0 },
  { pitch: NOTE_A4, duration: 1.0 },
  { pitch: NOTE_F4, duration: 1.0 },
  { pitch: NOTE_E4, duration: 1.0 },
  { pitch: NOTE_D4, duration: 1.5 },

  // Happy Birthday to you
  { pitch: NOTE_Bb4, duration: 0.75 },
  { pitch: NOTE_Bb4, duration: 0.25 },
  { pitch: NOTE_A4, duration: 1.0 },
  { pitch: NOTE_F4, duration: 1.0 },
  { pitch: NOTE_G4, duration: 1.0 },
  { pitch: NOTE_F4, duration: 2.5 }
];

class AudioController {
  private ctx: AudioContext | null = null;
  private isMelodyPlaying: boolean = false;
  private melodyTimer: NodeJS.Timeout | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Start looping background romantic music-box melody of Happy Birthday
   */
  public startBirthdayMelody() {
    if (this.isMelodyPlaying) return;
    this.isMelodyPlaying = true;
    this.playMelodyLoop();
  }

  private playMelodyLoop() {
    if (!this.isMelodyPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const beatDuration = 0.55; // Gentle, relaxed acoustic tempo
    let currentTimeOffset = 0;

    HAPPY_BIRTHDAY_MELODY.forEach((note) => {
      const delayMs = currentTimeOffset * 1000;
      setTimeout(() => {
        if (!this.isMelodyPlaying) return;
        this.playMusicBoxNote(note.pitch, note.duration * beatDuration);
      }, delayMs);

      currentTimeOffset += note.duration * beatDuration;
    });

    // Schedule next loop after entire melody finishes + gentle 2.5s pause
    const totalDurationMs = (currentTimeOffset + 2.5) * 1000;
    this.melodyTimer = setTimeout(() => {
      if (this.isMelodyPlaying) {
        this.playMelodyLoop();
      }
    }, totalDurationMs);
  }

  private playMusicBoxNote(freq: number, duration: number) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Primary acoustic bell tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with soft triangle harmonic creates a sweet music-box sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 1.5, 0.7));

      // Gentle warm overtone
      const overtoneOsc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtoneOsc.type = 'triangle';
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);

      overtoneGain.gain.setValueAtTime(0.0001, now);
      overtoneGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration * 1.5);
      overtoneOsc.start(now);
      overtoneOsc.stop(now + 0.45);
    } catch {
      // Audio fallback safe
    }
  }

  public playCandleWhoosh() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback safe
    }
  }

  public playCakeSliceSound() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);

      this.playCandleWhoosh();
    } catch {
      // Audio fallback safe
    }
  }

  public playGrandCelebration() {
    // Grand celebration chime chord
    const celebrationNotes = [NOTE_C4, NOTE_F4, NOTE_A4, NOTE_C5, NOTE_F5];
    celebrationNotes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 2.5);
      }, idx * 100);
    });
  }
}

export const audioController = new AudioController();
