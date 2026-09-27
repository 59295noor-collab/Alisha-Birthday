import { useEffect, useState, useMemo } from 'react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { fireGrandCelebrationBurst } from '../utils/confetti';
import { audioController } from '../audio/soundController';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';

interface FinalCelebrationProps {
  onRestart: () => void;
}

interface DriftingHeart {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // size in px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  swayDistance: number; // px
  rotation: number; // deg
  color: string;
}

export function FinalCelebration({ onRestart }: FinalCelebrationProps) {
  const [phase, setPhase] = useState<'bloom' | 'calm-end'>('bloom');
  const [showExitHint, setShowExitHint] = useState(false);

  // Generate randomized drifting heart particles
  const hearts = useMemo<DriftingHeart[]>(() => {
    const colors = [
      'rgba(244, 63, 94, 0.45)',  // Rose 500
      'rgba(251, 113, 133, 0.5)', // Rose 400
      'rgba(249, 168, 212, 0.55)',// Pink 300
      'rgba(253, 164, 175, 0.5)', // Rose 300
      'rgba(251, 191, 36, 0.45)'  // Amber 400
    ];

    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 94 + 3,
      size: Math.floor(Math.random() * 16) + 14, // 14px to 30px
      duration: Math.random() * 7 + 8, // 8s to 15s slow float
      delay: Math.random() * 6,
      opacity: Math.random() * 0.35 + 0.35, // 0.35 to 0.70
      swayDistance: (Math.random() - 0.5) * 60, // -30px to +30px
      rotation: (Math.random() - 0.5) * 45,
      color: colors[i % colors.length]
    }));
  }, []);

  useEffect(() => {
    audioController.playGrandCelebration();
    fireGrandCelebrationBurst();

    const t = setTimeout(() => {
      setPhase('calm-end');
    }, 2800);

    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    try {
      window.close();
    } catch {
      // Ignored
    }
    setShowExitHint(true);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 text-center select-none py-10 overflow-hidden">
      {/* Warm celebration ambient glowing halos */}
      <div className="absolute w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none translate-y-16" />

      {/* SLOW-DRIFTING ROMANTIC HEART PARTICLES BEHIND CONTENT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-[-50px] animate-float-heart"
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              opacity: heart.opacity,
              transform: `rotate(${heart.rotation}deg)`
            }}
          >
            <Heart
              style={{
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                fill: heart.color,
                color: heart.color,
                filter: 'drop-shadow(0 2px 6px rgba(244, 63, 94, 0.25))'
              }}
            />
          </div>
        ))}
      </div>

      {/* Hero Content (Above drifting hearts) */}
      <div className="relative z-10 space-y-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-rose-700/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Celebrating You Always</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* Hero Title */}
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl text-rose-950 font-normal tracking-tight leading-tight">
          Happy Birthday, <br />
          <span className="font-script-calligraphy text-6xl sm:text-8xl text-rose-600 block mt-2">
            {BIRTHDAY_CONFIG.recipientName} ❤️
          </span>
        </h1>

        {/* Calm Final Subtext */}
        <p
          className={`font-serif-cormorant italic text-lg sm:text-2xl text-stone-600 max-w-md mx-auto pt-3 leading-relaxed transition-all duration-1000 ${
            phase === 'calm-end' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {BIRTHDAY_CONFIG.finaleSubtext}
        </p>
      </div>

      {/* Exit & Actions Section */}
      <div
        className={`relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
          phase === 'calm-end' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={handleClose}
          className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>That&apos;s it ❤️</span>
          <Heart className="w-4 h-4 fill-white" />
        </button>

        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-stone-700 font-medium text-xs sm:text-sm tracking-wide transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
          <span>Experience Again</span>
        </button>
      </div>

      {showExitHint && (
        <div className="relative z-10 mt-6 animate-fade-in text-stone-500 text-sm font-light">
          {BIRTHDAY_CONFIG.exitPrompt}
        </div>
      )}
    </div>
  );
}
