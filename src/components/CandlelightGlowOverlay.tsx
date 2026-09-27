import { useEffect, useState, useRef } from 'react';

/**
 * CandlelightGlowOverlay
 * Renders an ethereal, organic radial gradient light that fluidly tracks
 * mouse or touch movements with soft lag (spring-like interpolation) and
 * gentle candle flame breathing/flicker.
 */
export function CandlelightGlowOverlay() {
  // Current interpolated light position
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Real target coordinates
  const targetPos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Set gentle initial center position on mount once window is available
    if (typeof window !== 'undefined') {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2.2;
      targetPos.current = { x: centerX, y: centerY };
      currentPos.current = { x: centerX, y: centerY };
      setPos({ x: centerX, y: centerY });
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      targetPos.current = { x: clientX, y: clientY };
      if (!hasInteracted) setHasInteracted(true);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerMove, { passive: true });

    // Smooth physics loop for organic candlelight tracking
    const updatePosition = () => {
      // Lerp (Linear Interpolation) with soft spring inertia factor
      const ease = 0.085;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      setPos({
        x: Math.round(currentPos.current.x * 10) / 10,
        y: Math.round(currentPos.current.y * 10) / 10
      });

      animFrameId.current = requestAnimationFrame(updatePosition);
    };

    animFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [hasInteracted]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-35 overflow-hidden transition-opacity duration-1000"
      style={{
        opacity: pos.x === -500 ? 0 : 1
      }}
    >
      {/* 1. Large Warm Ambient Candlelight Aura */}
      <div
        className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-soft-light transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '580px',
          height: '580px',
          background:
            'radial-gradient(circle closest-side, rgba(251, 191, 36, 0.28) 0%, rgba(244, 114, 182, 0.14) 45%, rgba(254, 205, 211, 0.05) 75%, transparent 100%)'
        }}
      />

      {/* 2. Soft Candle Flame Core with gentle organic breathing flicker */}
      <div
        className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-halo-pulse"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '320px',
          height: '320px',
          background:
            'radial-gradient(circle closest-side, rgba(254, 243, 199, 0.22) 0%, rgba(253, 186, 116, 0.12) 50%, transparent 100%)'
        }}
      />
    </div>
  );
}
