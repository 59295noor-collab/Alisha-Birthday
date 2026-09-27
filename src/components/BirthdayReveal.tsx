import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { fireLuxuryConfetti } from '../utils/confetti';
import { useEffect } from 'react';
import { Heart } from 'lucide-react';

interface BirthdayRevealProps {
  onContinue: () => void;
}

export function BirthdayReveal({ onContinue }: BirthdayRevealProps) {
  useEffect(() => {
    // Elegant soft celebratory confetti on reveal, no beeps
    const timer = setTimeout(() => {
      fireLuxuryConfetti();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center select-none py-10">
      {/* Warm rosy bokeh halo */}
      <div className="absolute w-[500px] h-[500px] bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none translate-y-12" />

      {/* Date Kicker */}
      <div className="mb-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-rose-700/90 font-medium">
        <span>7th October</span>
        <span>·</span>
        <span>A Special Day</span>
      </div>

      {/* Main Title Reveal */}
      <div className="max-w-xl mx-auto space-y-2">
        <h2 className="font-serif-cormorant text-4xl sm:text-6xl font-light text-stone-800 tracking-tight">
          Happy Birthday,
        </h2>

        {/* Hand-lettered Calligraphy for Alisha */}
        <div className="py-2">
          <h1 className="font-script-calligraphy text-7xl sm:text-9xl text-rose-600 font-normal leading-none">
            {BIRTHDAY_CONFIG.recipientName}
          </h1>
        </div>
      </div>

      {/* Tender love note subtext */}
      <p className="font-serif-cormorant italic text-lg sm:text-2xl text-stone-600 max-w-md mx-auto mt-4 font-light leading-relaxed">
        Today is all about you, your smile, and the warmth you bring into my world.
      </p>

      {/* Elegant Warm Button */}
      <div className="mt-12">
        <button
          onClick={onContinue}
          className="group px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm sm:text-base tracking-wide shadow-md shadow-rose-200/80 hover:shadow-lg hover:shadow-rose-300 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
        >
          <span>Read Your Letter</span>
          <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
