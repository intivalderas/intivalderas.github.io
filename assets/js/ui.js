/* =========================================
   UI: Sidebar, Scroll,
   Magnetic Buttons, Tags, Parallax
   ========================================= */

window.initNav = function () {
  const scrollIndicator = document.getElementById('scrollIndicator');

  // Scroll indicator fade
  window.addEventListener('scroll', () => {
    if (scrollIndicator && window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transition = 'opacity 0.5s ease';
    }
  });

};


window.initSmoothScroll = function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        if (window.closeSidebar) window.closeSidebar();
      }
    });
  });
};


window.initScrollReveal = function () {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('reveal--visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
};


window.initMagneticButtons = function () {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
};


window.initParallax = function () {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return;

  const heroSubtitle = document.querySelector('.hero__subtitle');
  const heroTags = document.querySelector('.hero__tags');

  // Scroll-based parallax (desktop + mobile)
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroTitle.style.transform = 'translateY(' + (scroll * 0.08) + 'px)';
      heroTitle.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
    }
  });

  // Gyroscope-based tilt shift (mobile)
  if (window.Gyroscope) {
    Gyroscope.on(function (gx, gy) {
      if (window.scrollY > window.innerHeight * 0.5) return;
      var offsetX = (gx - 0.5) * 20; // max ~10px each direction
      var offsetY = (gy - 0.5) * 10;
      heroTitle.style.transform = 'translateY(' + (window.scrollY * 0.08 + offsetY) + 'px) translateX(' + offsetX + 'px)';
      if (heroSubtitle) {
        heroSubtitle.style.transform = 'translateX(' + (offsetX * 0.6) + 'px) translateY(' + (offsetY * 0.6) + 'px)';
      }
      if (heroTags) {
        heroTags.style.transform = 'translateX(' + (offsetX * 0.4) + 'px) translateY(' + (offsetY * 0.4) + 'px)';
      }
    });
  }
};


window.initTagHover = function () {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.15s ease';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
};


window.initResume = function () {
  const toggleBtn = document.getElementById('resumeToggle');
  const backBtn = document.getElementById('resumeBack');
  const printBtn = document.getElementById('resumePrint');

  function enterResume(e) {
    e.preventDefault();
    document.body.classList.add('resume-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.closeSidebar) window.closeSidebar();
  }

  function exitResume(e) {
    e.preventDefault();
    document.body.classList.remove('resume-mode');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', enterResume);
  if (backBtn) backBtn.addEventListener('click', exitResume);
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
};
