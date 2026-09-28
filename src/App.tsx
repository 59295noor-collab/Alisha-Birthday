import { useEffect, useRef, useState } from 'react';
import { SceneState } from './config/birthdayConfig';
import { CinematicCanvas } from './components/CinematicCanvas';
import { CandlelightGlowOverlay } from './components/CandlelightGlowOverlay';
import { IntroScene } from './components/IntroScene';
import { BirthdayReveal } from './components/BirthdayReveal';
import { MessageScene } from './components/MessageScene';
import { CakeScene } from './components/CakeScene';
import { FinalCelebration } from './components/FinalCelebration';
import { audioController } from './audio/soundController';
import birthdayMelody from './assets/birthday-melody.wav';

export default function App() {
  const [scene, setScene] = useState<SceneState>('OPENING');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [knifeReady, setKnifeReady] = useState(false);

  // Attempt audible autoplay immediately. If the browser blocks autoplay,
  // the first tap/touch anywhere on the page unlocks the same melody.
  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = birthdayAudioRef.current;
    if (!audio) return;

    audio.volume = 1.95;
    audio.loop = true;
    audio.preload = 'auto';

    const tryStartMusic = () => {
      const result = audio.play();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    };

    tryStartMusic();

    const unlock = () => tryStartMusic();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });

    const resumeWhenVisible = () => {
      if (!document.hidden) tryStartMusic();
    };
    document.addEventListener('visibilitychange', resumeWhenVisible);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', resumeWhenVisible);
    };
  }, []);

  // Central transition controller with soft blush/warm cream blink
  const navigateTo = (nextScene: SceneState, holdDuration: number = 700) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setScene(nextScene);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, holdDuration);
  };

  const handleUserInteraction = () => {
    const audio = birthdayAudioRef.current;
    if (!audio) return;
    const result = audio.play();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  };

  const handleIntroComplete = () => {
    navigateTo('REVEAL', 600);
  };

  const handleRevealContinue = () => {
    navigateTo('MESSAGE', 750);
  };

  const handleMessageContinue = () => {
    navigateTo('CAKE_CANDLES', 800);
  };

  const handleBlowCandles = () => {
    audioController.playCandleWhoosh();
    setCandlesBlown(true);

    // Breathing room before knife appears
    setTimeout(() => {
      setKnifeReady(true);
    }, 1800);
  };

  const handleSliceCake = () => {
    navigateTo('CELEBRATION', 500);
  };

  const handleRestart = () => {
    setCandlesBlown(false);
    setKnifeReady(false);
    navigateTo('OPENING', 600);
  };

  return (
    <div
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      className="relative w-full min-h-[100dvh] bg-parchment text-[#2D1810] overflow-y-auto select-none"
    >
      <audio
        ref={birthdayAudioRef}
        src={birthdayMelody}
        autoPlay
        loop
        preload="auto"
        playsInline
        aria-hidden="true"
        className="hidden"
      />
      {/* Floating Rose Petals Canvas */}
      <CinematicCanvas />

      {/* Romantic Cursor/Touch Candlelight Radial Glow Overlay */}
      <CandlelightGlowOverlay />

      {/* Active Scene Content */}
      <div className="relative w-full h-full overflow-hidden">
        {scene === 'OPENING' && <IntroScene onIntroComplete={handleIntroComplete} />}
        {scene === 'REVEAL' && <BirthdayReveal onContinue={handleRevealContinue} />}
        {scene === 'MESSAGE' && <MessageScene onContinue={handleMessageContinue} />}
        {scene === 'CAKE_CANDLES' && (
          <CakeScene
            candlesBlown={candlesBlown}
            onBlowCandles={handleBlowCandles}
            knifeReady={knifeReady}
            onSliceCake={handleSliceCake}
          />
        )}
        {scene === 'CELEBRATION' && <FinalCelebration onRestart={handleRestart} />}
      </div>

      {/* SOFT WARM BLUSH TRANSITION BLINK */}
      <div
        className={`fixed inset-0 z-40 pointer-events-none transition-all duration-600 ease-in-out ${
          isTransitioning
            ? 'opacity-100 bg-[#FED7E2]/60 backdrop-blur-sm'
            : 'opacity-0 backdrop-blur-0 pointer-events-none'
        }`}
      />
    </div>
  );
}
