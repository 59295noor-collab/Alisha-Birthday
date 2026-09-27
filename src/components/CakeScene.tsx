import { useState, useRef } from 'react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { audioController } from '../audio/soundController';
import { fireGrandCelebrationBurst, fireLuxuryConfetti, fireSliceMicroBurst } from '../utils/confetti';
import cakePhoto from '../assets/images/alisha_birthday_cake.jpg';

interface CakeSceneProps {
  candlesBlown: boolean;
  onBlowCandles: () => void;
  knifeReady: boolean;
  onSliceCake: () => void;
}

export function CakeScene({
  candlesBlown,
  onBlowCandles,
  knifeReady,
  onSliceCake
}: CakeSceneProps) {
  const [sliceProgress, setSliceProgress] = useState(0); // 0 to 100
  const [isSlicing, setIsSlicing] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [hasCutCompleted, setHasCutCompleted] = useState(false);
  const cakeContainerRef = useRef<HTMLDivElement | null>(null);

  const handleBlowClick = () => {
    if (isBlowing || candlesBlown) return;
    setIsBlowing(true);
    audioController.playCandleWhoosh();

    // Trigger gust extinguish animation, then transition to extinguished with smoke
    setTimeout(() => {
      onBlowCandles();
      setIsBlowing(false);
    }, 450);
  };

  const handleCutClick = () => {
    if (isSlicing || hasCutCompleted) return;
    setIsSlicing(true);
    audioController.playCakeSliceSound();

    let prog = 0;
    // Human-like tactile pressing downward rhythm
    const interval = setInterval(() => {
      prog += 2.2;
      if (prog >= 100) {
        prog = 100;
        setSliceProgress(100);
        clearInterval(interval);
        setHasCutCompleted(true);

        // Calculate cake coordinates for precise confetti origin
        let originX = 0.5;
        let originY = 0.52;
        if (cakeContainerRef.current) {
          const rect = cakeContainerRef.current.getBoundingClientRect();
          originX = (rect.left + rect.width / 2) / window.innerWidth;
          originY = (rect.top + rect.height * 0.55) / window.innerHeight;
        }

        // 1. Subtle, tactile particle burst precisely at the cake cut line
        fireSliceMicroBurst(originX, originY);

        // 2. Play celebration sound effects & grand burst
        audioController.playGrandCelebration();
        setTimeout(() => {
          fireGrandCelebrationBurst();
          fireLuxuryConfetti();
        }, 300);

        // 3. Cinematic pause to savor the separated cake slices before advancing to celebration
        setTimeout(() => {
          onSliceCake();
        }, 2200);
      } else {
        setSliceProgress(prog);
      }
    }, 40);
  };

  // Realistic separation physics calculations
  const splitPixels = hasCutCompleted ? 18 : (sliceProgress / 100) * 16;
  const splitAngle = hasCutCompleted ? 2.2 : (sliceProgress / 100) * 1.8;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-3.5 sm:px-6 text-center select-none py-6 sm:py-8">
      {/* Warm candlelight ambient halo across the background */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[520px] sm:h-[520px] rounded-full pointer-events-none transition-all duration-1000 ${
          !candlesBlown
            ? 'bg-amber-300/35 blur-3xl scale-125 opacity-90'
            : isSlicing || hasCutCompleted
            ? 'bg-rose-200/40 blur-3xl scale-140 opacity-90'
            : 'bg-rose-100/25 blur-3xl scale-95 opacity-30'
        }`}
      />

      {/* Header Guidance with fluid relative typography */}
      <div className="mb-2 sm:mb-3 space-y-1 z-20 max-w-md mx-auto">
        <span className="font-sans-clean text-[0.68rem] sm:text-xs uppercase tracking-widest text-rose-800/90 font-semibold block">
          Make A Wish · Alisha
        </span>

        <h2 className="font-serif-cormorant text-2xl sm:text-4xl md:text-5xl text-rose-950 font-normal leading-tight">
          {!candlesBlown
            ? 'Make a wish.'
            : isSlicing
            ? 'Cutting the Birthday Cake...'
            : hasCutCompleted
            ? 'Happy Birthday, Alisha!'
            : knifeReady
            ? 'Hold the knife to cut the cake.'
            : 'Wish made.'}
        </h2>
        <p className="font-serif-cormorant italic text-stone-600 text-sm sm:text-base leading-snug sm:leading-normal max-w-xs sm:max-w-sm mx-auto">
          {!candlesBlown
            ? 'Take a deep breath, make your wish, and blow out the candles.'
            : isSlicing || hasCutCompleted
            ? 'A sweet celebration of your special day.'
            : knifeReady
            ? 'Press the button below to cut your birthday cake together.'
            : 'May all your wishes bloom into reality.'}
        </p>
      </div>

      {/* ARTISANAL CAKE CONTAINER WITH TACTILE REALISTIC CSS SEPARATION */}
      <div
        ref={cakeContainerRef}
        className={`relative w-64 h-64 sm:w-96 sm:h-96 flex flex-col items-center justify-end select-none my-2 sm:my-3 ${
          hasCutCompleted ? 'animate-cake-impact' : ''
        }`}
      >
        {/* Bakery Cake Frame with dual-half split capability */}
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 ring-1 ring-rose-200/80 bg-stone-900">
          
          {/* LEFT HALF OF CAKE - Realistic transform separation with subtle tilt */}
          <div
            className="absolute inset-0 w-1/2 overflow-hidden transition-all duration-700 ease-out z-10"
            style={{
              transformOrigin: 'bottom left',
              transform: `translateX(-${splitPixels}px) rotate(-${splitAngle}deg)`
            }}
          >
            <img
              src={cakePhoto}
              alt="Alisha's Birthday Cake left"
              className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover object-left"
            />
          </div>

          {/* RIGHT HALF OF CAKE - Realistic transform separation with subtle tilt */}
          <div
            className="absolute inset-0 left-1/2 w-1/2 overflow-hidden transition-all duration-700 ease-out z-10"
            style={{
              transformOrigin: 'bottom right',
              transform: `translateX(${splitPixels}px) rotate(${splitAngle}deg)`
            }}
          >
            <img
              src={cakePhoto}
              alt="Alisha's Birthday Cake right"
              className="absolute top-0 right-0 h-full w-[200%] max-w-none object-cover object-right"
            />
          </div>

          {/* REALISTIC FROSTING CRUMB & SPONGE TEXTURE IN THE INCISION GAP */}
          {sliceProgress > 10 && (
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3.5 sm:w-4 z-15 pointer-events-none transition-all duration-300"
              style={{
                opacity: Math.min(sliceProgress / 45, 1),
                background: 'linear-gradient(to right, rgba(90,45,28,0.75), rgba(255,248,240,0.95), rgba(90,45,28,0.75))'
              }}
            >
              <div className="w-full h-full flex flex-col justify-around items-center opacity-70">
                <span className="w-1 h-1 bg-[#D97706] rounded-full inline-block" />
                <span className="w-1.5 h-1 bg-[#F43F5E] rounded-full inline-block" />
                <span className="w-1 h-1 bg-[#FEF08A] rounded-full inline-block" />
                <span className="w-1.5 h-1 bg-[#9A3412] rounded-full inline-block" />
              </div>
            </div>
          )}

          {/* REALISTIC 3D CANDLES WITH DYNAMIC MULTI-LAYER FLAMES */}
          <div className="absolute top-6 sm:top-9 left-0 right-0 flex items-center justify-center gap-7 sm:gap-14 z-30 pointer-events-none">
            {[0, 1, 2].map((idx) => {
              const flameHeight = idx === 1 ? 'h-7 sm:h-10' : 'h-6 sm:h-9';
              const flameWidth = idx === 1 ? 'w-3.5 sm:w-5' : 'w-3 sm:w-4';

              return (
                <div key={idx} className="flex flex-col items-center relative">
                  {/* FLAME / SMOKE COMPONENT */}
                  <div className="h-10 sm:h-12 flex items-end justify-center relative pb-0.5">
                    {!candlesBlown && !isBlowing && (
                      <div className="relative flex flex-col items-center animate-realistic-flame">
                        <div className="absolute w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-amber-400/40 blur-lg -top-2 animate-halo-pulse pointer-events-none" />
                        <div
                          className={`${flameWidth} ${flameHeight} bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 rounded-t-full rounded-b-2xl shadow-[0_0_15px_rgba(255,160,20,0.85)] relative flex items-end justify-center`}
                        >
                          <div className="w-1.5 sm:w-2.5 h-3.5 sm:h-5 bg-gradient-to-t from-yellow-300 via-yellow-100 to-white rounded-t-full rounded-b-lg mb-0.5 shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-95" />
                          <div className="absolute bottom-0 w-2 sm:w-2.5 h-1 sm:h-1.5 bg-blue-500/80 rounded-b-full blur-[0.5px]" />
                        </div>
                      </div>
                    )}

                    {/* BLOWING OUT WIND GUST STATE */}
                    {isBlowing && (
                      <div className="relative flex flex-col items-center animate-flame-blown">
                        <div
                          className={`${flameWidth} ${flameHeight} bg-gradient-to-t from-orange-600 via-amber-300 to-yellow-100 rounded-full shadow-[0_0_20px_rgba(255,120,20,1)]`}
                        />
                      </div>
                    )}

                    {/* POST-EXTINGUISH REALISTIC SMOKE WISPS */}
                    {candlesBlown && (
                      <div className="relative flex flex-col items-center pointer-events-none">
                        <div className="absolute bottom-0 w-3 h-8 bg-gradient-to-t from-stone-400/70 via-stone-300/40 to-transparent rounded-full blur-[2px] animate-smoke-wisp" />
                        <div
                          className="absolute bottom-0 w-2 h-6 bg-gradient-to-t from-stone-300/60 to-transparent rounded-full blur-[1.5px] animate-smoke-wisp"
                          style={{ animationDelay: '0.25s' }}
                        />
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_4px_rgba(239,68,68,0.9)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* CANDLE WICK */}
                  <div className="w-0.5 h-2 sm:h-2.5 bg-stone-900 rounded-t-xs -mb-0.5 z-20" />

                  {/* CANDLE STICK */}
                  <div className="w-2.5 sm:w-3.5 h-9 sm:h-12 rounded-t-[2px] shadow-lg bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 border-x border-amber-500/40 relative">
                    <div className="absolute left-0.5 top-0 bottom-0 w-0.5 bg-white/60 blur-[0.3px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-600/30" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* REALISTIC HUMAN HAND & GOLDEN CAKE SERVER / KNIFE CUTTING DOWN */}
          {isSlicing && (
            <div
              className="absolute z-50 left-1/2 pointer-events-none transition-all duration-75"
              style={{
                top: `${Math.max(sliceProgress * 0.88 - 30, -20)}%`,
                transform: `translateX(-50%) rotate(${Math.sin((sliceProgress / 100) * Math.PI * 4) * 2 - 12}deg)`
              }}
            >
              <div className="relative filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.55)] scale-90 sm:scale-100 origin-top">
                <svg width="240" height="260" viewBox="0 0 240 260" fill="none">
                  {/* Hand Cast Shadow */}
                  <ellipse cx="120" cy="195" rx="55" ry="18" fill="black" fillOpacity="0.25" filter="blur(6px)" />

                  {/* THE REALISTIC CHEF/CAKE KNIFE */}
                  <g id="knife">
                    <path
                      d="M120 70 L123 185 Q120 200 117 185 L120 70 Z"
                      fill="url(#bladeSteelGradient)"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                    <line x1="120" y1="70" x2="120" y2="192" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.95" />
                    
                    <rect x="113" y="65" width="14" height="7" rx="2" fill="#BE123C" />
                    <rect x="114" y="20" width="12" height="47" rx="3" fill="#2E1005" />
                    <circle cx="120" cy="32" r="1.5" fill="#FBBF24" />
                    <circle cx="120" cy="50" r="1.5" fill="#FBBF24" />
                  </g>

                  {/* REALISTIC HUMAN HANDS */}
                  <g id="hands">
                    <path
                      d="M190 0 C175 18 155 35 135 40 L130 52 C150 48 175 30 198 12 Z"
                      fill="#FFF1F2"
                      opacity="0.95"
                    />
                    <ellipse cx="132" cy="46" rx="16" ry="12" fill="#E8B49B" transform="rotate(-15 132 46)" />
                    <path
                      d="M112 30 C108 30 106 36 112 38 L126 38 C130 38 130 30 126 30 Z"
                      fill="#F2C4AC"
                      stroke="#D79E83"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M112 39 C107 39 105 45 111 47 L126 47 C130 47 130 39 126 39 Z"
                      fill="#F7CDB7"
                      stroke="#D79E83"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M112 48 C107 48 105 54 111 56 L126 56 C130 56 130 48 126 48 Z"
                      fill="#F7CDB7"
                      stroke="#D79E83"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M50 0 C68 20 90 35 112 40 L115 50 C95 45 70 25 45 10 Z"
                      fill="#FDF2F8"
                      opacity="0.95"
                    />
                    <ellipse cx="116" cy="42" rx="15" ry="10" fill="#E1A98F" transform="rotate(20 116 42)" />
                    <path
                      d="M114 26 C110 26 109 32 115 34 L127 34 C131 34 131 26 127 26 Z"
                      fill="#ECC0A8"
                      stroke="#C98B6F"
                      strokeWidth="0.8"
                    />
                  </g>

                  <defs>
                    <linearGradient id="bladeSteelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="35%" stopColor="#F8FAFC" />
                      <stop offset="65%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          {/* Name overlay ribbon */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-0.5 sm:py-1 rounded-full shadow-md border border-rose-200/90 z-20">
            <span className="font-script-calligraphy text-xl sm:text-3xl text-rose-700 leading-none">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
          </div>
        </div>
      </div>

      {/* CONTROLS with relative sizing */}
      <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2.5 sm:gap-3 min-h-[56px] sm:min-h-[64px] z-20 w-full max-w-xs">
        {/* Step 1: Blow the candles */}
        {!candlesBlown && (
          <button
            onClick={handleBlowClick}
            disabled={isBlowing}
            className="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-300/80 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <span>{isBlowing ? 'Blowing candles...' : 'Blow the candles'}</span>
            <span className="text-lg sm:text-xl">💨</span>
          </button>
        )}

        {/* Step 2: Hold knife to cut cake */}
        {candlesBlown && knifeReady && (
          <div className="w-full flex flex-col items-center gap-2 animate-fade-in">
            <button
              onClick={handleCutClick}
              disabled={isSlicing || hasCutCompleted}
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold text-sm sm:text-base shadow-xl shadow-rose-400/50 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer active:scale-95 transform hover:-translate-y-0.5"
            >
              <span>
                {hasCutCompleted
                  ? '✨ Cake Sliced!'
                  : isSlicing
                  ? 'Cutting with Love...'
                  : 'Hold Knife & Cut Cake'}
              </span>
              <span className="text-lg sm:text-xl">🎂</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
