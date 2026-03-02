/* =========================================
   Settings Panel
   Toggle effects + dark mode + localStorage
   ========================================= */

window.initSettings = function () {
  var panel = document.getElementById('settingsPanel');
  var toggle = document.getElementById('settingsToggle');
  var isDesktop = window.innerWidth > 768;

  if (!panel || !toggle) return;

  // Show/hide gyroscope toggle on mobile only
  var gyroRow = document.getElementById('settingGyroRow');
  if (gyroRow) {
    gyroRow.style.display = isDesktop ? 'none' : '';
  }

  // Show/hide cursor toggle on desktop only
  var cursorRow = document.getElementById('settingCursorRow');
  if (cursorRow) {
    cursorRow.style.display = isDesktop ? '' : 'none';
  }

  // --- Toggle panel open/close ---
  toggle.addEventListener('click', function () {
    // Close sticker tray if open
    var stickerTray = document.getElementById('stickerTray');
    if (stickerTray) {
      stickerTray.classList.remove('sticker-tray--open');
      var st = document.getElementById('stickerToggle');
      if (st) st.setAttribute('aria-expanded', 'false');
    }
    // Close draw tool if open
    if (window.closeDrawMenu) window.closeDrawMenu();
    var isOpen = panel.classList.toggle('settings__panel--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close panel when clicking outside
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      panel.classList.remove('settings__panel--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // --- Setting handlers ---
  var darkToggle = document.getElementById('settingDarkMode');
  var particlesToggle = document.getElementById('settingParticles');
  var motionToggle = document.getElementById('settingMotion');
  var gyroToggle = document.getElementById('settingGyroscope');
  var cursorToggle = document.getElementById('settingCursor');
  var disableAllToggle = document.getElementById('settingDisableAll');

  // Restore saved preferences
  function loadPrefs() {
    var darkPref = localStorage.getItem('setting-dark-mode');
    var particlesPref = localStorage.getItem('setting-particles');
    var motionPref = localStorage.getItem('setting-motion');
    var gyroPref = localStorage.getItem('setting-gyroscope');
    var cursorPref = localStorage.getItem('setting-cursor');
    var disableAllPref = localStorage.getItem('setting-disable-all');

    if (darkPref === 'true') {
      document.body.classList.add('dark-mode');
      if (darkToggle) darkToggle.checked = true;
    }

    if (particlesPref === 'false') {
      var canvas = document.getElementById('particleCanvas');
      if (canvas) canvas.style.display = 'none';
      if (particlesToggle) particlesToggle.checked = false;
    }

    if (motionPref === 'false') {
      document.body.classList.add('reduced-effects');
      if (motionToggle) motionToggle.checked = false;
    }

    if (cursorPref === 'false' && isDesktop) {
      document.body.classList.add('cursor--disabled');
      if (cursorToggle) cursorToggle.checked = false;
    }

    if (gyroPref === 'true' && !isDesktop && window.Gyroscope) {
      Gyroscope.init();
      if (gyroToggle) gyroToggle.checked = true;
    }

    if (disableAllPref === 'true') {
      if (disableAllToggle) disableAllToggle.checked = true;
    }
  }

  loadPrefs();

  // Dark mode
  if (darkToggle) {
    darkToggle.addEventListener('change', function () {
      var isDark = darkToggle.checked;
      console.log('[setting] dark mode:', isDark ? 'on' : 'off');
      window.psTrack('Setting_DarkMode_' + (isDark ? 'On' : 'Off'));
      document.body.classList.toggle('dark-mode', isDark);
      localStorage.setItem('setting-dark-mode', String(isDark));

      // Flash transition (same as easter egg)
      var flash = document.createElement('div');
      flash.style.cssText =
        'position:fixed;inset:0;z-index:99999;pointer-events:none;opacity:1;transition:opacity 0.5s ease;' +
        'background:' + (isDark ? '#0a0a0a' : '#fafafa');
      document.body.appendChild(flash);
      requestAnimationFrame(function () {
        flash.style.opacity = '0';
        setTimeout(function () { flash.remove(); }, 500);
      });
    });
  }

  // Particles
  if (particlesToggle) {
    particlesToggle.addEventListener('change', function () {
      var canvas = document.getElementById('particleCanvas');
      if (canvas) {
        canvas.style.display = particlesToggle.checked ? '' : 'none';
      }
      console.log('[setting] particles:', particlesToggle.checked ? 'on' : 'off');
      window.psTrack('Setting_Particles_' + (particlesToggle.checked ? 'On' : 'Off'));
      localStorage.setItem('setting-particles', String(particlesToggle.checked));
      uncheckMasterIfNeeded();
    });
  }

  // Motion effects
  if (motionToggle) {
    motionToggle.addEventListener('change', function () {
      console.log('[setting] motion:', motionToggle.checked ? 'on' : 'off');
      window.psTrack('Setting_Motion_' + (motionToggle.checked ? 'On' : 'Off'));
      document.body.classList.toggle('reduced-effects', !motionToggle.checked);
      localStorage.setItem('setting-motion', String(motionToggle.checked));
      uncheckMasterIfNeeded();
    });
  }

  // Custom cursor
  if (cursorToggle) {
    cursorToggle.addEventListener('change', function () {
      console.log('[setting] cursor:', cursorToggle.checked ? 'on' : 'off');
      window.psTrack('Setting_Cursor_' + (cursorToggle.checked ? 'On' : 'Off'));
      document.body.classList.toggle('cursor--disabled', !cursorToggle.checked);
      localStorage.setItem('setting-cursor', String(cursorToggle.checked));
      uncheckMasterIfNeeded();
    });
  }

  // Gyroscope
  if (gyroToggle) {
    gyroToggle.addEventListener('change', function () {
      if (gyroToggle.checked) {
        if (window.Gyroscope) {
          Gyroscope.init().then(function (ok) {
            if (!ok) {
              gyroToggle.checked = false;
              localStorage.setItem('setting-gyroscope', 'false');
            }
          });
        }
      } else {
        if (window.Gyroscope) Gyroscope.deactivate();
      }
      console.log('[setting] gyroscope:', gyroToggle.checked ? 'on' : 'off');
      window.psTrack('Setting_Gyroscope_' + (gyroToggle.checked ? 'On' : 'Off'));
      localStorage.setItem('setting-gyroscope', String(gyroToggle.checked));
      uncheckMasterIfNeeded();
    });
  }

  // --- Disable all effects (master toggle) ---
  function uncheckMasterIfNeeded() {
    if (!disableAllToggle || !disableAllToggle.checked) return;
    // If any effect toggle was re-enabled, uncheck master
    var anyOn = (particlesToggle && particlesToggle.checked) ||
                (motionToggle && motionToggle.checked) ||
                (cursorToggle && cursorToggle.checked) ||
                (gyroToggle && gyroToggle.checked);
    if (anyOn) {
      disableAllToggle.checked = false;
      localStorage.setItem('setting-disable-all', 'false');
    }
  }

  if (disableAllToggle) {
    disableAllToggle.addEventListener('change', function () {
      var disabling = disableAllToggle.checked;
      console.log('[setting] disable all:', disabling ? 'on' : 'off');
      window.psTrack('Setting_DisableAll_' + (disabling ? 'On' : 'Off'));
      localStorage.setItem('setting-disable-all', String(disabling));

      if (disabling) {
        // Turn off all effect toggles
        if (particlesToggle && particlesToggle.checked) {
          particlesToggle.checked = false;
          particlesToggle.dispatchEvent(new Event('change'));
        }
        if (motionToggle && motionToggle.checked) {
          motionToggle.checked = false;
          motionToggle.dispatchEvent(new Event('change'));
        }
        if (cursorToggle && cursorToggle.checked) {
          cursorToggle.checked = false;
          cursorToggle.dispatchEvent(new Event('change'));
        }
        if (gyroToggle && gyroToggle.checked) {
          gyroToggle.checked = false;
          gyroToggle.dispatchEvent(new Event('change'));
        }
        // Re-check master since dispatched changes will have unchecked it
        disableAllToggle.checked = true;
        localStorage.setItem('setting-disable-all', 'true');
      } else {
        // Restore defaults: particles, motion, cursor on
        if (particlesToggle && !particlesToggle.checked) {
          particlesToggle.checked = true;
          particlesToggle.dispatchEvent(new Event('change'));
        }
        if (motionToggle && !motionToggle.checked) {
          motionToggle.checked = true;
          motionToggle.dispatchEvent(new Event('change'));
        }
        if (cursorToggle && !cursorToggle.checked && isDesktop) {
          cursorToggle.checked = true;
          cursorToggle.dispatchEvent(new Event('change'));
        }
      }
    });
  }

  // --- Analytics / Privacy toggle ---
  var analyticsToggle = document.getElementById('settingAnalytics');
  var cookieDetailsBtn = document.getElementById('settingsCookieDetails');

  // Sync initial state from localStorage
  var consentValue = null;
  try { consentValue = localStorage.getItem('cookie-consent'); } catch (e) {}
  if (analyticsToggle) {
    analyticsToggle.checked = consentValue === 'accepted';
  }

  // Toggle analytics on/off
  if (analyticsToggle) {
    analyticsToggle.addEventListener('change', function () {
      console.log('[setting] analytics:', analyticsToggle.checked ? 'on' : 'off');
      if (analyticsToggle.checked) {
        try { localStorage.setItem('cookie-consent', 'accepted'); } catch (e) {}
        // Load PageSense if not already loaded
        var psUrl = 'https://cdn-eu.pagesense.io/js/valderas/9cebd5d067e944efbf91fdc07ac8407c.js';
        if (!document.querySelector('script[src="' + psUrl + '"]')) {
          var s = document.createElement('script');
          s.src = psUrl;
          s.async = true;
          document.head.appendChild(s);
        }
      } else {
        try { localStorage.setItem('cookie-consent', 'declined'); } catch (e) {}
      }
      // Hide banner if visible
      var banner = document.getElementById('cookieBanner');
      if (banner && banner.classList.contains('consent-banner--visible')) {
        banner.classList.remove('consent-banner--visible');
        var details = document.getElementById('cookieDetails');
        if (details) details.setAttribute('hidden', '');
        banner.addEventListener('transitionend', function handler() {
          banner.setAttribute('hidden', '');
          banner.removeEventListener('transitionend', handler);
        });
      }
    });
  }

  // "What gets tracked?" — show banner with details expanded
  if (cookieDetailsBtn) {
    cookieDetailsBtn.addEventListener('click', function () {
      var banner = document.getElementById('cookieBanner');
      var details = document.getElementById('cookieDetails');
      if (banner) {
        banner.removeAttribute('hidden');
        banner.offsetHeight;
        banner.classList.add('consent-banner--visible');
      }
      if (details) details.removeAttribute('hidden');
      // Close settings panel
      panel.classList.remove('settings__panel--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Expose sync method for dark mode easter egg
  window.syncDarkModeToggle = function (isDark) {
    if (darkToggle) darkToggle.checked = isDark;
    localStorage.setItem('setting-dark-mode', String(isDark));
  };
};
