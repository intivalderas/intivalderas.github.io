/* =========================================
   Custom Cursor + Particle Trail
   ========================================= */

window.initCursor = function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = document.querySelectorAll('a, button, .tag, .magnetic-btn, .sticker-tray__item, .sticker-tray__toggle, .sticker-tray__clear');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
};


window.initParticles = function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let lastParticleTime = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2.5 + 1;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.size *= 0.99;
    }

    draw(ctx) {
      const isDark = document.body.classList.contains('dark-mode');
      const color = isDark ? '250, 250, 250' : '10, 10, 10';
      ctx.fillStyle = `rgba(${color}, ${this.life * 0.3})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var isDesktop = window.innerWidth > 768;

  if (isDesktop) {
    // Desktop: mouse-driven particles
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastParticleTime > 30) {
        particles.push(new Particle(e.clientX, e.clientY));
        lastParticleTime = now;
      }
    });
  } else {
    // Mobile: ambient particles at random positions, biased by gyroscope tilt
    var gyroVx = 0, gyroVy = 0;
    if (window.Gyroscope) {
      Gyroscope.on(function (gx, gy) {
        gyroVx = (gx - 0.5) * 1.5;
        gyroVy = (gy - 0.5) * 1.0;
      });
    }

    setInterval(function () {
      if (canvas.style.display === 'none') return;
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var p = new Particle(x, y);
      p.vx += gyroVx;
      p.vy += gyroVy;
      p.decay = Math.random() * 0.008 + 0.005;
      particles.push(p);
    }, 200);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  animate();
};
