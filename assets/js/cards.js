/* =========================================
   3D Tilt + Shine on Project Cards
   ========================================= */
/* =========================================
   Gradient border follow on Kind Words cards
   ========================================= */

window.initKindWordsGradient = function () {
  var cards = document.querySelectorAll('.kind-words__card');

  // Desktop: mouse-driven gradient
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--gradient-x', x + '%');
      card.style.setProperty('--gradient-y', y + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--gradient-x');
      card.style.removeProperty('--gradient-y');
    });
  });

  // Mobile: gyroscope-driven gradient for visible cards
  if (window.Gyroscope) {
    var visibleCards = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleCards.add(entry.target);
        } else {
          visibleCards.delete(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) { observer.observe(card); });

    Gyroscope.on(function (gx, gy) {
      var x = (gx * 100).toFixed(1) + '%';
      var y = (gy * 100).toFixed(1) + '%';
      visibleCards.forEach(function (card) {
        card.style.setProperty('--gradient-x', x);
        card.style.setProperty('--gradient-y', y);
      });
    });
  }
};

window.initKindWordsVibes = function () {
  var section = document.querySelector('.section--kind-words');
  if (!section) return;

  // --- IntersectionObserver to toggle active class ---
  var isActive = false;
  var animId = null;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        section.classList.add('kind-words--active');
        if (!isActive) {
          isActive = true;
          animate();
        }
      } else {
        section.classList.remove('kind-words--active');
        isActive = false;
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.15 });

  observer.observe(section);

  // --- Canvas setup ---
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;bottom:0;left:50%;width:100vw;transform:translateX(-50%);z-index:1;pointer-events:none;';
  canvas.setAttribute('aria-hidden', 'true');
  section.insertBefore(canvas, section.firstChild);

  // Make card grid and header sit above canvas + ::before
  var grid = section.querySelector('.kind-words__grid');
  if (grid) { grid.style.position = 'relative'; grid.style.zIndex = '2'; }
  var header = section.querySelector('.section__header');
  if (header) { header.style.position = 'relative'; header.style.zIndex = '2'; }

  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Particles ---
  var heartColors = ['#ff8a80', '#f48fb1', '#ffab91', '#ffcc80'];
  var sparkleColors = ['#ffd54f', '#fff176', '#ffffff'];
  var particles = [];
  var maxParticles = 18;

  function spawnParticle() {
    var isHeart = Math.random() > 0.4;
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.3 + Math.random() * 0.5),
      size: isHeart ? 10 + Math.random() * 8 : 8 + Math.random() * 6,
      char: isHeart ? '\u2665' : '\u2726',
      color: isHeart
        ? heartColors[Math.floor(Math.random() * heartColors.length)]
        : sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      opacity: 0.7 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2
    };
  }

  // Pre-populate
  for (var i = 0; i < maxParticles; i++) {
    var p = spawnParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  var time = 0;

  function animate() {
    if (!isActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.02;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx + Math.sin(time + p.phase) * 0.3;
      p.y += p.vy;

      // Fade near top
      var fadeZone = canvas.height * 0.2;
      var alpha = p.y < fadeZone ? (p.y / fadeZone) * p.opacity : p.opacity;

      if (p.y < -20 || alpha <= 0) {
        particles[i] = spawnParticle();
        continue;
      }

      ctx.globalAlpha = alpha;
      ctx.font = p.size + 'px serif';
      ctx.fillStyle = p.color;
      ctx.fillText(p.char, p.x, p.y);
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(animate);
  }
};

window.initCardTilt = function () {
  document.querySelectorAll('.project-card').forEach(card => {
    const imageEl = card.querySelector('.project-card__image');
    if (imageEl) {
      const shine = document.createElement('div');
      shine.classList.add('project-card__shine');
      imageEl.appendChild(shine);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';

      const shineEl = card.querySelector('.project-card__shine');
      if (shineEl) {
        shineEl.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255,255,255,0.15), transparent 60%)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
    });
  });
};
