/**
 * Programmatic Web Audio Synthesizer: Romantic Celesta, Music Box & Warm Pad
 * Refined for zero pinching / ear fatigue, enhanced velvety sweetness, warm acoustic charm,
 * and a smooth, gentle waltz tempo (flowing rhythm without dragging or dragging delay).
 */

interface Note {
  pitch: number;      // Lead melody frequency in Hz
  duration: number;   // In beats
  harmony?: number[]; // Background harmonic chord accompaniment
  accent?: number;    // Relative volume dynamic velocity (0.8 - 1.1)
}

// Romantic Key of F Major / D Minor frequencies
const NOTE_F3 = 174.61;
const NOTE_A3 = 220.00;
const NOTE_Bb3 = 233.08;
const NOTE_C4 = 261.63;
const NOTE_D4 = 293.66;
const NOTE_E4 = 329.63;
const NOTE_F4 = 349.23;
const NOTE_G4 = 392.00;
const NOTE_A4 = 440.00;
const NOTE_Bb4 = 466.16;
const NOTE_C5 = 523.25;
const NOTE_D5 = 587.33;
const NOTE_E5 = 659.25;
const NOTE_F5 = 698.46;
const NOTE_G5 = 783.99;
const NOTE_A5 = 880.00;

// Sweet & Charming Romantic Arrangement of "Happy Birthday To You"
// Perfectly balanced durations for natural waltz flow (tempo 0.42s per beat)
const SWEET_BIRTHDAY_MELODY: Note[] = [
  // Measure 1: "Hap-py Birth-day to you..." (Gentle F Major harmony)
  { pitch: NOTE_C4, duration: 0.75, accent: 0.9, harmony: [NOTE_F3, NOTE_A3, NOTE_C4] },
  { pitch: NOTE_C4, duration: 0.25, accent: 0.8 },
  { pitch: NOTE_D4, duration: 1.0, accent: 0.95 },
  { pitch: NOTE_C4, duration: 1.0, accent: 0.92 },
  { pitch: NOTE_F4, duration: 1.0, accent: 1.05, harmony: [NOTE_A3, NOTE_C4] },
  { pitch: NOTE_E4, duration: 1.8, accent: 0.88, harmony: [196.0, NOTE_C4, NOTE_E4] },

  // Measure 2: "Hap-py Birth-day to you..." (Warm C7 / F gentle resolution)
  { pitch: NOTE_C4, duration: 0.75, accent: 0.9, harmony: [NOTE_C4, NOTE_E4] },
  { pitch: NOTE_C4, duration: 0.25, accent: 0.8 },
  { pitch: NOTE_D4, duration: 1.0, accent: 0.95 },
  { pitch: NOTE_C4, duration: 1.0, accent: 0.92 },
  { pitch: NOTE_G4, duration: 1.0, accent: 1.08, harmony: [NOTE_Bb3, NOTE_D4] },
  { pitch: NOTE_F4, duration: 1.9, accent: 0.9, harmony: [NOTE_F3, NOTE_A3, NOTE_C4] },

  // Measure 3: "Hap-py Birth-day dear A-li-sha..." (Tender octave rise & romantic climax)
  { pitch: NOTE_C4, duration: 0.75, accent: 0.9, harmony: [NOTE_F3, NOTE_C4] },
  { pitch: NOTE_C4, duration: 0.25, accent: 0.82 },
  { pitch: NOTE_C5, duration: 1.05, accent: 1.15, harmony: [NOTE_A3, NOTE_C4, NOTE_F4] },
  { pitch: NOTE_A4, duration: 1.0, accent: 1.02, harmony: [NOTE_D4, NOTE_F4] },
  { pitch: NOTE_F4, duration: 1.0, accent: 0.95, harmony: [NOTE_Bb3, NOTE_D4] },
  { pitch: NOTE_E4, duration: 1.0, accent: 0.9, harmony: [NOTE_A3, NOTE_C4] },
  { pitch: NOTE_D4, duration: 1.5, accent: 0.95, harmony: [NOTE_Bb3, NOTE_D4, NOTE_F4] },

  // Measure 4: "Hap-py Birth-day to you..." (Romantic resolve with sweet glockenspiel sparkle)
  { pitch: NOTE_Bb4, duration: 0.75, accent: 1.02, harmony: [NOTE_Bb3, NOTE_D4] },
  { pitch: NOTE_Bb4, duration: 0.25, accent: 0.82 },
  { pitch: NOTE_A4, duration: 1.0, accent: 1.08, harmony: [NOTE_F3, NOTE_A3, NOTE_C4] },
  { pitch: NOTE_F4, duration: 1.0, accent: 0.95, harmony: [NOTE_D4, NOTE_F4] },
  { pitch: NOTE_G4, duration: 1.0, accent: 0.98, harmony: [NOTE_C4, NOTE_E4, NOTE_G4] },
  { pitch: NOTE_F4, duration: 2.5, accent: 1.08, harmony: [NOTE_F3, NOTE_A3, NOTE_C4, NOTE_F4] }
];

class AudioController {
  private ctx: AudioContext | null = null;
  private isMelodyPlaying: boolean = false;
  private melodyTimer: NodeJS.Timeout | null = null;
  private activeTimeouts: NodeJS.Timeout[] = [];
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private warmFilterNode: BiquadFilterNode | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.initAudioGraph(this.ctx);
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
   * Builds an acoustic cathedral / warm chamber reverb impulse response
   * to give the music box a lush, velvety, fairytale presence with zero harshness.
   */
  private initAudioGraph(ctx: AudioContext) {
    try {
      // 1. Master Output Gain
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, ctx.currentTime);

      // 2. Warm Tone Butter-Filter (gentle lowpass at 3400Hz completely eliminates sharp "pinch")
      this.warmFilterNode = ctx.createBiquadFilter();
      this.warmFilterNode.type = 'lowpass';
      this.warmFilterNode.frequency.setValueAtTime(3400, ctx.currentTime);
      this.warmFilterNode.Q.setValueAtTime(0.5, ctx.currentTime); // Gentle Bessel-like slope

      // 3. Stereo Soft Diffused Echo
      this.delayNode = ctx.createDelay(1.5);
      this.delayNode.delayTime.setValueAtTime(0.28, ctx.currentTime); // 280ms musical rhythm echo

      this.delayFeedbackGain = ctx.createGain();
      this.delayFeedbackGain.gain.setValueAtTime(0.2, ctx.currentTime);

      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1800, ctx.currentTime);

      // Delay feedback loop
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedbackGain);
      this.delayFeedbackGain.connect(this.delayNode);

      // 4. Lush Algorithmic Reverb Impulse (2.2s decay, diffused Gaussian-style)
      const sampleRate = ctx.sampleRate;
      const decaySecs = 2.2;
      const length = sampleRate * decaySecs;
      const impulseBuffer = ctx.createBuffer(2, length, sampleRate);
      const left = impulseBuffer.getChannelData(0);
      const right = impulseBuffer.getChannelData(1);

      for (let i = 0; i < length; i++) {
        // Smooth exponential decay curve
        const decay = Math.exp(-i / (sampleRate * 0.65));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
      }

      this.reverbNode = ctx.createConvolver();
      this.reverbNode.buffer = impulseBuffer;

      const reverbGain = ctx.createGain();
      reverbGain.gain.setValueAtTime(0.38, ctx.currentTime);

      const delayOutGain = ctx.createGain();
      delayOutGain.gain.setValueAtTime(0.18, ctx.currentTime);

      // Connect Graph:
      // warmFilter -> masterGain -> destination
      // warmFilter -> reverbNode -> reverbGain -> destination
      // warmFilter -> delayNode -> delayOutGain -> reverbNode
      this.warmFilterNode.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);

      this.warmFilterNode.connect(this.reverbNode);
      this.reverbNode.connect(reverbGain);
      reverbGain.connect(ctx.destination);

      this.warmFilterNode.connect(this.delayNode);
      this.delayNode.connect(delayOutGain);
      delayOutGain.connect(this.reverbNode);
    } catch {
      // Audio graph gracefully degrades
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

  public stopBirthdayMelody() {
    this.isMelodyPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];
  }

  private playMelodyLoop() {
    if (!this.isMelodyPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Clear any previous note timers
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];

    // Tender, romantic music-box tempo (0.53s per beat - relaxed, sweet and intimate)
    const beatDuration = 0.53; 
    let currentTimeOffset = 0;

    SWEET_BIRTHDAY_MELODY.forEach((note) => {
      const delayMs = currentTimeOffset * 1000;
      
      const t = setTimeout(() => {
        if (!this.isMelodyPlaying) return;
        
        // 1. Play Soft, Sweet Celesta/Music-Box Note
        this.playSweetChime(note.pitch, note.duration * beatDuration, note.accent ?? 1.0);

        // 2. If harmony chord exists, play soft warm pad / harp resonance underneath
        if (note.harmony && note.harmony.length > 0) {
          note.harmony.forEach((hFreq, hIndex) => {
            // Gentle harp strum delay (32ms) for charming romantic sweetness
            setTimeout(() => {
              if (this.isMelodyPlaying) {
                this.playWarmPadNote(hFreq, note.duration * beatDuration * 1.4);
              }
            }, hIndex * 32);
          });
        }
      }, delayMs);

      this.activeTimeouts.push(t);
      currentTimeOffset += note.duration * beatDuration;
    });

    // Short, natural transition gap (0.75s) so the melody loops continuously and gracefully
    const totalDurationMs = (currentTimeOffset + 0.75) * 1000;
    this.melodyTimer = setTimeout(() => {
      if (this.isMelodyPlaying) {
        this.playMelodyLoop();
      }
    }, totalDurationMs);
  }

  /**
   * Synthesizes a velvety-soft, warm & charming music box chime:
   * - Soft curved attack (no sharp transient or click / pinch effect)
   * - Pure, rounded sine wave fundamental
   * - Subtle, soft harmonic overtone (+1 octave) at low volume for sweetness
   * - Vibrato LFO (4.8 Hz, depth 2.5Hz) adding touching emotional warmth
   */
  private playSweetChime(freq: number, duration: number, accent: number) {
    try {
      const ctx = this.getContext();
      if (!ctx || !this.warmFilterNode) return;
      const now = ctx.currentTime;
      const noteVol = 0.20 * Math.max(0.65, accent);

      // --- Component A: Primary Warm Sine Bell Body ---
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Add gentle emotional vibrato (warm acoustic breath)
      const vibratoOsc = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibratoOsc.frequency.setValueAtTime(4.8, now); // 4.8 Hz romantic vibrato
      vibratoGain.gain.setValueAtTime(2.2, now); // subtle 2.2Hz pitch fluctuation
      vibratoOsc.connect(osc1.frequency);
      vibratoOsc.start(now);
      vibratoOsc.stop(now + duration * 2.2);

      // Attack time set to 28ms to completely eliminate any click/pinch
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(noteVol, now + 0.028);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 2.0, 1.2));

      osc1.connect(gain1);
      gain1.connect(this.warmFilterNode);

      // --- Component B: Gentle Warm Overtone (Low Volume, No Piercing Tine) ---
      const oscOct = ctx.createOscillator();
      const gainOct = ctx.createGain();
      oscOct.type = 'sine';
      oscOct.frequency.setValueAtTime(freq * 2, now);

      gainOct.gain.setValueAtTime(0.0001, now);
      gainOct.gain.linearRampToValueAtTime(noteVol * 0.25, now + 0.035);
      gainOct.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 1.4, 0.8));

      oscOct.connect(gainOct);
      gainOct.connect(this.warmFilterNode);

      // Start & Stop Notes
      const stopTime = now + Math.max(duration * 2.1, 1.3);
      osc1.start(now);
      oscOct.start(now);

      osc1.stop(stopTime);
      oscOct.stop(stopTime);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Soft, warm acoustic backing pad (deep, rounded cello/harp hum)
   * Enriches the low/mid frequencies so every chime feels cuddled by warmth.
   */
  private playWarmPadNote(freq: number, duration: number) {
    try {
      const ctx = this.getContext();
      if (!ctx || !this.warmFilterNode) return;
      const now = ctx.currentTime;
      const padVol = 0.065; // Warm, soothing presence

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with low-pass filter gives a pillowy acoustic resonance
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(240, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      // Soft blooming 65ms fade-in
      gain.gain.linearRampToValueAtTime(padVol, now + 0.065);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.warmFilterNode);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Candle blow-out: realistic breathy wind whoosh with soft air dissipation
   */
  public playCandleWhoosh() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.55;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.48);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Tactile cake slice cut sound with smooth cream glide and gentle chime
   */
  public playCakeSliceSound() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Soft cream slice tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.32);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      // Wind whisper accompanying knife motion
      this.playCandleWhoosh();
    } catch {
      // Safe fallback
    }
  }

  /**
   * Grand celebration harmonic sparkle chord arpeggio with celebratory bell cascades
   */
  public playGrandCelebration() {
    const celebrationNotes = [
      NOTE_F3,
      NOTE_C4,
      NOTE_F4,
      NOTE_A4,
      NOTE_C5,
      NOTE_E5,
      NOTE_G5,
      NOTE_A5
    ];
    
    celebrationNotes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSweetChime(freq, 2.6, 1.15);
      }, idx * 95);
    });
  }
}

export const audioController = new AudioController();
