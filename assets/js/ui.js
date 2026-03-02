/* =========================================
   UI: Nav, Scroll, Mobile Menu,
   Magnetic Buttons, Tags, Parallax
   ========================================= */

window.initNav = function () {
  const nav = document.getElementById('nav');
  const scrollIndicator = document.getElementById('scrollIndicator');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    if (scrollIndicator && currentScroll > 200) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transition = 'opacity 0.5s ease';
    }
  });
};


window.initMobileMenu = function () {
  const navMenu = document.getElementById('navMenu');
  const mobileNav = document.getElementById('mobileNav');

  if (!navMenu || !mobileNav) return;

  navMenu.addEventListener('click', () => {
    navMenu.classList.toggle('nav__menu--active');
    mobileNav.classList.toggle('mobile-nav--active');
    const isOpen = mobileNav.classList.contains('mobile-nav--active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    navMenu.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--active');
      mobileNav.classList.remove('mobile-nav--active');
      document.body.style.overflow = '';
      navMenu.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
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

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroTitle.style.transform = 'translateY(' + (scroll * 0.08) + 'px)';
      heroTitle.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
    }
  });
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
  const toggleMobile = document.getElementById('resumeToggleMobile');
  const backBtn = document.getElementById('resumeBack');
  const printBtn = document.getElementById('resumePrint');
  const navMenu = document.getElementById('navMenu');
  const mobileNav = document.getElementById('mobileNav');

  function enterResume(e) {
    e.preventDefault();
    document.body.classList.add('resume-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close mobile menu if open
    if (navMenu) {
      navMenu.classList.remove('nav__menu--active');
      navMenu.setAttribute('aria-expanded', 'false');
    }
    if (mobileNav) {
      mobileNav.classList.remove('mobile-nav--active');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function exitResume(e) {
    e.preventDefault();
    document.body.classList.remove('resume-mode');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', enterResume);
  if (toggleMobile) toggleMobile.addEventListener('click', enterResume);
  if (backBtn) backBtn.addEventListener('click', exitResume);
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
};
