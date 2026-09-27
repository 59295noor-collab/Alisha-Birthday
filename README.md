# Alisha Birthday ❤️

A personalized interactive birthday celebration website for Alisha.

## Experience

- Animated opening and birthday reveal
- Personal birthday message
- Interactive candle-blowing scene
- Interactive cake-cutting scene
- Celebration finale with confetti and sound
- Responsive mobile-first layout

## Run locally

Prerequisite: Node.js 20.19+ (or 22.12+)

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Production build

```bash
npm run build
```

The production files are generated in `dist/`.

## Deployment

This is a static Vite frontend. Deploy the `dist/` directory to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or another static hosting provider.

## Personalization

Birthday content is centralized in `src/config/birthdayConfig.ts`.

## License

Personal project.


## Birthday melody autoplay
The birthday melody is a local `birthday-melody.wav` asset attached to an HTML `<audio>` element with `autoPlay`, `loop`, `preload`, and `playsInline`. The app attempts to start it immediately on page load. Modern mobile browsers may still block audible autoplay on a fresh visit; when that happens, the first tap/touch anywhere on the page unlocks the same melody without requiring a dedicated music button.
