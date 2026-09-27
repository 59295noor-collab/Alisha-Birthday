import confetti from 'canvas-confetti';

/**
 * High-end luxury confetti palette:
 * Champagne gold, rose blush, warm burgundy, and pearlescent ivory.
 */
export function fireLuxuryConfetti() {
  try {
    const count = 70;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#FB7185', '#F59E0B', '#FDE047', '#E2E8F0', '#FDA4AF'],
      ticks: 200,
      gravity: 0.85,
      scalar: 1.1,
      shapes: ['circle', 'square'] as confetti.Shape[]
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 60,
      startVelocity: 45
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 100,
      startVelocity: 35
    });
  } catch {
    // Non-critical animation
  }
}

/**
 * Tactile micro-burst precisely centered on the cake slice line
 * triggered at the exact moment the slice confirms.
 */
export function fireSliceMicroBurst(xOrigin: number = 0.5, yOrigin: number = 0.55) {
  try {
    // Elegant, gentle mini-sparkle particle burst
    confetti({
      particleCount: 35,
      spread: 70,
      startVelocity: 28,
      gravity: 0.95,
      ticks: 120,
      origin: { x: xOrigin, y: yOrigin },
      colors: ['#FDE047', '#FBBF24', '#F43F5E', '#FDA4AF', '#FFFFFF', '#FCD34D'],
      scalar: 0.85,
      shapes: ['circle', 'square'] as confetti.Shape[]
    });
  } catch {
    // Non-critical animation
  }
}

export function fireGrandCelebrationBurst() {
  try {
    const end = Date.now() + 2.8 * 1000;
    const colors = ['#F43F5E', '#FBBF24', '#F472B6', '#FCD34D', '#FFF1F2'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors,
        scalar: 1.2
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors,
        scalar: 1.2
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch {
    // Non-critical animation
  }
}
