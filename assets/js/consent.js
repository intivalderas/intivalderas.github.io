/* ============================================
   Cookie Consent — GDPR-compliant PageSense loader
   Only injects analytics after explicit user consent.
   ============================================ */

// Safe PageSense event tracker — only fires when consent is accepted.
// Usage: window.psTrack('Contact')
window.psTrack = function psTrack(eventName) {
  try {
    if (localStorage.getItem('cookie-consent') !== 'accepted') return;
  } catch (e) { return; }
  window.pagesense = window.pagesense || [];
  window.pagesense.push(['trackEvent', eventName]);
};

window.initConsent = function initConsent() {
  var STORAGE_KEY = 'cookie-consent';
  var PAGESENSE_URL = 'https://cdn-eu.pagesense.io/js/valderas/9cebd5d067e944efbf91fdc07ac8407c.js';

  var banner = document.getElementById('cookieBanner');
  var acceptBtn = document.getElementById('cookieAccept');
  var declineBtn = document.getElementById('cookieDecline');
  var settingsBtn = document.getElementById('cookieSettings');
  var learnMoreBtn = document.getElementById('cookieLearnMore');
  var detailsPanel = document.getElementById('cookieDetails');

  if (!banner) return;

  function loadPageSense() {
    // Avoid double-injection
    if (document.querySelector('script[src="' + PAGESENSE_URL + '"]')) return;
    var s = document.createElement('script');
    s.src = PAGESENSE_URL;
    s.async = true;
    document.head.appendChild(s);
  }

  function showBanner() {
    banner.removeAttribute('hidden');
    // Trigger reflow so the transition plays
    banner.offsetHeight;
    banner.classList.add('consent-banner--visible');
  }

  function hideBanner() {
    banner.classList.remove('consent-banner--visible');
    // Collapse details when hiding
    if (detailsPanel) detailsPanel.setAttribute('hidden', '');
    banner.addEventListener('transitionend', function handler() {
      banner.setAttribute('hidden', '');
      banner.removeEventListener('transitionend', handler);
    });
  }

  function showDetails() {
    if (detailsPanel) detailsPanel.removeAttribute('hidden');
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private browsing */ }
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  // Wire up buttons
  acceptBtn.addEventListener('click', function () {
    setConsent('accepted');
    hideBanner();
    loadPageSense();
    window.syncAnalyticsToggle(true);
  });

  declineBtn.addEventListener('click', function () {
    setConsent('declined');
    hideBanner();
    window.syncAnalyticsToggle(false);
  });

  // "Learn more" toggle
  if (learnMoreBtn && detailsPanel) {
    learnMoreBtn.addEventListener('click', function () {
      if (detailsPanel.hasAttribute('hidden')) {
        showDetails();
      } else {
        detailsPanel.setAttribute('hidden', '');
      }
    });
  }

  // Footer "Cookie settings" link — re-show banner with details expanded
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEY);
      showBanner();
      showDetails();
    });
  }

  // Sync the settings analytics toggle from banner actions
  window.syncAnalyticsToggle = function (accepted) {
    var analyticsToggle = document.getElementById('settingAnalytics');
    if (analyticsToggle) analyticsToggle.checked = accepted;
  };

  // Init: check stored preference
  var consent = getConsent();
  if (consent === 'accepted') {
    loadPageSense();
    window.syncAnalyticsToggle(true);
  } else if (consent === 'declined') {
    window.syncAnalyticsToggle(false);
  } else {
    showBanner();
  }

  // --- Track key interactions ---
  // Contact email
  var emailLink = document.querySelector('.contact__email');
  if (emailLink) emailLink.addEventListener('click', function () { window.psTrack('Contact'); });

  // Social links
  document.querySelectorAll('.contact__link').forEach(function (link) {
    link.addEventListener('click', function () {
      var label = link.textContent.trim();
      window.psTrack('Social_' + label);
    });
  });

  // Resume open
  var resumeBtn = document.getElementById('resumeToggle');
  if (resumeBtn) resumeBtn.addEventListener('click', function () { window.psTrack('Resume_Open'); });

  // Resume download / print
  var printBtn = document.getElementById('resumePrint');
  if (printBtn) printBtn.addEventListener('click', function () { window.psTrack('Resume_Download'); });
};
