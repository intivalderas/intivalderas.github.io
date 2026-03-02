/* ============================================
   Inti Valderas Caro — Portfolio
   Loader — all modules attach to window.*
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.innerWidth > 768;

  // Text effects (always)
  initLetterAnimation();
  initTextScramble();

  // UI (always)
  initNav();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initTagHover();

  // Desktop-only interactions
  if (isDesktop) {
    initCursor();
    initParticles();
    initCardTilt();
    initMagneticButtons();
    initParallax();
  }

  // Interactive features
  initStickers();
  initDarkMode();
  initResume();
});
