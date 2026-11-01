# Trilemma animatic

Silent 45-second motion test for the Story 2 Trilemma section, built from the Tria Trilemma shape.
The output is `../tria-trilemma-animatic-v1.mp4`.

- `trilemma.html` draws each frame on a canvas (exact wedge and triangle geometry from `Trialama_shape.svg`).
- `render.js` drives it with Playwright and encodes it with ffmpeg:
  `node render.js out.mp4 30 0 45`, or `node render.js --stills 7.5,24,41` for key frames.

Not committed: `assets/` (placeholder iStock photos, Lexend Deca and Manrope font files). To re-render, put
`access.jpg`, `quality.jpg`, `cost.jpg`, `dark.jpg`, `lexend.woff2` and `manrope.woff2` in `assets/`.
