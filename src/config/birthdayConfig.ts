export interface BirthdayConfig {
  recipientName: string;
  birthdayDate: string;
  messageLines: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    postscript: string;
  };
  finaleSubtext: string;
  exitPrompt: string;
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  recipientName: 'Alisha',
  birthdayDate: '7 October',
  messageLines: {
    salutation: 'Happy Birthday, Alisha ❤️',
    paragraphs: [
      '7th October is a pretty special day, and I hope you always have a reason to smile when it comes around.',
      'I’m genuinely glad to have you in my life. You’re beautiful, charming, and honestly just a really special person to me. I appreciate the little things about you more than I probably say.',
      'I hope this year brings you happiness, peace, success, and a lot of good moments. You deserve to enjoy your life, achieve what you want, and have people around you who truly value you.'
    ],
    closing: 'Have an amazing birthday, Alisha. ❤️',
    postscript: 'And yes, you’re getting a little extra attention today because it’s your day. :)'
  },
  finaleSubtext: 'May this year be full of beautiful moments.',
  exitPrompt: 'You can close this tab now ❤️'
};

export type SceneState =
  | 'OPENING'          // Cinematic entrance with "7 October" then "Alisha" (5s)
  | 'REVEAL'           // Title reveal "Happy Birthday, Alisha" + confetti
  | 'MESSAGE'          // Heartfelt letter with smooth typewriter rhythm
  | 'CAKE_CANDLES'     // "Make a wish." -> candle blowing -> realistic cake cutting
  | 'CELEBRATION';     // Celebration conclusion with message, music & replay
