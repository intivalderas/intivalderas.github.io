/* ============================================
   Contact Form — "Pick two" toggles + mailto
   Identifies visitor in PageSense on submit.
   ============================================ */

window.initContact = function initContact() {
  var toggles = document.querySelectorAll('.contact__toggle');
  var status = document.querySelector('.contact__status');
  var form = document.getElementById('contactForm');

  if (!form) return;

  // --- Toggle logic (max 2 active, FIFO bump) ---
  var active = []; // ordered list of active toggle values

  var statusCopy = {
    'cheap+fast': 'Good? Maybe next time.',
    'cheap+good': 'Fast? Not a chance.',
    'fast+good':  "Cheap? That's cute.",
    'default':    "Pick any two. That's the deal."
  };

  function getComboKey() {
    if (active.length < 2) return 'default';
    var sorted = active.slice().sort();
    return sorted[0] + '+' + sorted[1];
  }

  function updateStatus() {
    var key = getComboKey();
    if (status) status.textContent = statusCopy[key] || statusCopy['default'];
  }

  function syncButtons() {
    toggles.forEach(function (btn) {
      var val = btn.getAttribute('data-toggle');
      var isActive = active.indexOf(val) !== -1;
      btn.classList.toggle('contact__toggle--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-toggle');
      var idx = active.indexOf(val);

      if (idx !== -1) {
        // Deactivate
        active.splice(idx, 1);
      } else {
        // Activate — bump oldest if already 2
        if (active.length >= 2) active.shift();
        active.push(val);
      }

      syncButtons();
      updateStatus();
    });
  });

  // --- Form submit → SalesIQ + mailto ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();

    if (!name || !email || !message) return;

    var combo = active.length === 2
      ? active.slice().sort().map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' + ')
      : '';

    // Identify visitor in PageSense (silently fails if not loaded / no consent)
    try {
      window.pagesense = window.pagesense || [];
      window.pagesense.push(['identifyUser', email, { name: name }]);
    } catch (err) { /* PageSense not loaded — that's fine */ }

    // Track event via PageSense
    if (typeof window.psTrack === 'function') window.psTrack('Contact_Form');

    // Open mailto
    var subject = encodeURIComponent('New project' + (combo ? ' (' + combo + ')' : ''));
    var body = encodeURIComponent(
      'Hi Inti,\n\n' + message + '\n\n— ' + name + '\n' + email
    );
    window.location.href = 'mailto:inti@valderas.be?subject=' + subject + '&body=' + body;
  });
};
