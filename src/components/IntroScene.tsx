import { useEffect, useState } from 'react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';

interface IntroSceneProps {
  onIntroComplete: () => void;
}

export function IntroScene({ onIntroComplete }: IntroSceneProps) {
  const [phase, setPhase] = useState<'start' | 'visible'>('start');

  useEffect(() => {
    // Reveal content after 200ms
    const tStart = setTimeout(() => {
      setPhase('visible');
    }, 200);

    // Wait exactly 5 seconds total from opening, then move smoothly to next screen
    const tComplete = setTimeout(() => {
      onIntroComplete();
    }, 5000);

    return () => {
      clearTimeout(tStart);
      clearTimeout(tComplete);
    };
  }, [onIntroComplete]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center select-none">
      {/* Warm ambient sunset & candle glow */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none -translate-y-4" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-100/50 blur-2xl pointer-events-none translate-y-8" />

      {/* Date */}
      <div
        className={`transition-all duration-1000 ease-out transform ${
          phase === 'visible'
            ? 'opacity-100 translate-y-0 filter-none'
            : 'opacity-0 translate-y-4 blur-xs'
        }`}
      >
        <span className="font-sans-clean text-xs sm:text-sm uppercase tracking-[0.3em] text-rose-800/80 font-medium">
          {BIRTHDAY_CONFIG.birthdayDate}
        </span>
      </div>

      {/* Delicate line divider */}
      <div
        className={`w-16 h-[1px] bg-rose-300/60 my-6 transition-all duration-1000 ${
          phase === 'visible' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`}
      />

      {/* Name in authentic romantic calligraphy */}
      <div
        className={`transition-all duration-1000 ease-out transform ${
          phase === 'visible'
            ? 'opacity-100 translate-y-0 scale-100 filter-none'
            : 'opacity-0 translate-y-6 scale-95 blur-sm'
        }`}
      >
        <h1 className="font-script-calligraphy text-6xl sm:text-8xl text-rose-900 font-normal tracking-wide px-4">
          {BIRTHDAY_CONFIG.recipientName}
        </h1>
        <p className="font-serif-cormorant italic text-stone-500 text-sm sm:text-base mt-2">
          An intimate celebration just for you
        </p>
      </div>
    </div>
  );
}
