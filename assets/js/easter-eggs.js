/* =========================================
   Easter Eggs: Dark Mode Toggle
   Triple-click the logo to activate
   ========================================= */

window.initDarkMode = function () {
  const logo = document.querySelector('.sidebar__logo');
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener('click', (e) => {
    clickCount++;
    clearTimeout(clickTimer);

    if (clickCount >= 3) {
      e.preventDefault();
      clickCount = 0;
      document.body.classList.toggle('dark-mode');

      var isDark = document.body.classList.contains('dark-mode');

      // Sync with settings panel
      if (window.syncDarkModeToggle) {
        syncDarkModeToggle(isDark);
      }

      // Flash transition
      const flash = document.createElement('div');
      flash.style.cssText =
        'position:fixed;inset:0;z-index:99999;pointer-events:none;opacity:1;transition:opacity 0.5s ease;' +
        'background:' + (isDark ? '#0a0a0a' : '#fafafa');
      document.body.appendChild(flash);
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
      });
    }

    clickTimer = setTimeout(() => { clickCount = 0; }, 400);
  });
};
