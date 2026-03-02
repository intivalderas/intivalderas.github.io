/* ============================================
   Inti Valderas Caro — Portfolio
   Loader — all modules attach to window.*
   ============================================ */

// Console greeting for the curious ones
console.log(
  '%c Hey there, nosey nosey! 👀',
  'font-size: 16px; font-weight: bold; color: #000; background: #fafafa; padding: 8px 12px; border-radius: 4px;'
);
console.log(
  '%c Designed by Inti Valderas · Built by Claude Code\n' +
  '%c Zero deps. Zero build steps. Just vibes.\n\n' +
  'Poke around the source → https://github.com/intivalderas/valderas.be\n' +
  'Psst... try triple-clicking the logo.',
  'font-size: 12px; font-weight: bold;',
  'font-size: 12px; font-style: italic; color: #888;'
);

document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.innerWidth > 768;

  // Consent (first — before analytics would fire)
  initConsent();

  // Settings (early, so saved prefs apply before other modules)
  initSettings();

  // Text effects (always)
  initLetterAnimation();
  initTextScramble();

  // UI (always)
  initNav();
  initSmoothScroll();
  initScrollReveal();
  initTagHover();

  // Desktop-only interactions
  if (isDesktop) {
    if (!document.body.classList.contains('cursor--disabled')) {
      initCursor();
    }
    initCardTilt();
    initMagneticButtons();
  }

  // Particles + kind-words gradient run on both desktop and mobile
  // (mobile uses gyroscope/ambient mode instead of mouse)
  initParticles();
  initKindWordsGradient();
  initKindWordsVibes();
  initParallax();

  // Interactive features
  initStickers();
  initDraw();
  initDarkMode();
  initResume();
});
