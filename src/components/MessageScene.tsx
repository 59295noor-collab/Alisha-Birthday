import { useState, useEffect, useRef } from 'react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { Heart } from 'lucide-react';

interface MessageSceneProps {
  onContinue: () => void;
}

export function MessageScene({ onContinue }: MessageSceneProps) {
  const { salutation, paragraphs, closing, postscript } = BIRTHDAY_CONFIG.messageLines;

  // Build the complete letter text string
  const fullText = useRef<string>(
    `${salutation}\n\n${paragraphs[0]}\n\n${paragraphs[1]}\n\n${paragraphs[2]}\n\n${closing}\n${postscript}`
  ).current;

  // Character index for smooth character-by-character typing
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (charIndex < fullText.length) {
      const currentChar = fullText[charIndex];
      // Dynamic natural rhythm
      let delay = 26;
      if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        delay = 180;
      } else if (currentChar === ',') {
        delay = 100;
      } else if (currentChar === '\n') {
        delay = 120;
      }

      const timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setIsTypingDone(true);
    }
  }, [charIndex, fullText]);

  const displayedText = fullText.slice(0, charIndex);

  return (
    <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-start px-3.5 sm:px-6 py-6 sm:py-14 overflow-y-auto">
      {/* Warm ambient sunset glow in background */}
      <div className="fixed w-72 sm:w-[500px] h-72 sm:h-[500px] bg-rose-100/60 rounded-full blur-3xl pointer-events-none top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Romantic Paper Stationery Letter Card */}
      <div className="relative w-full max-w-xl mx-auto rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 bg-[#FFFDFB] border border-rose-200/90 shadow-2xl shadow-rose-950/10 my-auto">
        {/* Decorative Top Stationery Header */}
        <div className="flex items-center justify-between pb-3.5 sm:pb-5 mb-5 sm:mb-8 border-b border-rose-100/90">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
            <span className="tracking-widest uppercase text-[0.68rem] sm:text-xs font-semibold text-rose-900/90">
              Personal Letter For Alisha
            </span>
          </div>

          <span className="font-serif-cormorant italic text-stone-600 text-xs sm:text-sm">
            {BIRTHDAY_CONFIG.birthdayDate}
          </span>
        </div>

        {/* Character-by-Character Smoothly Typed Letter with fluid responsive typography */}
        <div className="text-[#301C16] font-serif-cormorant text-[1.05rem] sm:text-xl md:text-2xl leading-[1.7] sm:leading-relaxed md:leading-loose whitespace-pre-wrap select-text break-words">
          {displayedText}
          {/* Active warm typing cursor */}
          {!isTypingDone && (
            <span className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-rose-500 ml-1 translate-y-0.5 animate-pulse rounded-xs" />
          )}
        </div>

        {/* "There's one more thing" Button */}
        <div
          className={`mt-7 sm:mt-10 pt-4 sm:pt-6 border-t border-rose-100 flex justify-end transition-all duration-700 ${
            isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
          }`}
        >
          <button
            onClick={onContinue}
            className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm sm:text-base tracking-wide shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
          >
            <span>There&apos;s one more thing</span>
            <span className="text-base sm:text-lg">🎂</span>
          </button>
        </div>
      </div>
    </div>
  );
}
