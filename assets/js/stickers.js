/* =========================================
   Draggable Stickers & Post-its
   ========================================= */

(function () {
  function makeDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onStart = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
      isDragging = true;
      const clientX = e.touches ? e.touches[0].pageX : e.pageX;
      const clientY = e.touches ? e.touches[0].pageY : e.pageY;
      startX = clientX;
      startY = clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      el.style.transition = 'none';
      el.style.zIndex = 52;
      el.style.transform = 'scale(1.08) rotate(0deg)';
    };

    const onMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].pageX : e.pageX;
      const clientY = e.touches ? e.touches[0].pageY : e.pageY;
      const dx = clientX - startX;
      const dy = clientY - startY;
      el.style.left = (initialLeft + dx) + 'px';
      el.style.top = (initialTop + dy) + 'px';
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const rotation = (Math.random() - 0.5) * 6;
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'scale(1) rotate(' + rotation + 'deg)';
      el.style.zIndex = 51;
    };

    el.addEventListener('mousedown', onStart);
    el.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  function removeSticker(sticker) {
    sticker.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    sticker.style.transform = 'scale(0) rotate(20deg)';
    sticker.style.opacity = '0';
    setTimeout(() => sticker.remove(), 300);
  }

  window.initStickers = function () {
    const stickerTray = document.getElementById('stickerTray');
    const stickerToggle = document.getElementById('stickerToggle');
    const stickerItems = document.getElementById('stickerItems');
    const stickerCanvas = document.getElementById('stickerCanvas');
    const stickerClear = document.getElementById('stickerClear');

    if (!stickerTray || !stickerCanvas) return;

    function onKeyActivate(handler) {
      return function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler.call(this, e);
        }
      };
    }

    // Toggle tray
    if (stickerToggle) {
      const toggleTray = () => {
        stickerTray.classList.toggle('sticker-tray--open');
        const isOpen = stickerTray.classList.contains('sticker-tray--open');
        stickerToggle.setAttribute('aria-expanded', String(isOpen));
      };
      stickerToggle.addEventListener('click', toggleTray);
      stickerToggle.addEventListener('keydown', onKeyActivate(toggleTray));
    }

    // Clear all stickers
    if (stickerClear) {
      const clearAll = () => {
        const stickers = stickerCanvas.querySelectorAll('.sticker');
        stickers.forEach((s, i) => {
          setTimeout(() => removeSticker(s), i * 50);
        });
      };
      stickerClear.addEventListener('click', clearAll);
      stickerClear.addEventListener('keydown', onKeyActivate(clearAll));
    }

    // Place stickers
    if (stickerItems) {
      stickerItems.querySelectorAll('.sticker-tray__item:not(.sticker-tray__clear)').forEach(item => {
        const placeSticker = () => {
          const type = item.dataset.type || 'emoji';
          const emoji = item.dataset.sticker;
          const color = item.dataset.color || '#fef3c7';
          const rotation = (Math.random() - 0.5) * 8;

          const sticker = document.createElement('div');
          sticker.classList.add('sticker', type === 'postit' ? 'sticker--postit' : 'sticker--emoji');
          sticker.style.setProperty('--rotation', rotation + 'deg');

          // Position near current viewport center (using page coordinates)
          const x = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
          const y = window.scrollY + window.innerHeight / 2 + (Math.random() - 0.5) * 200;
          sticker.style.left = x + 'px';
          sticker.style.top = y + 'px';

          if (type === 'postit') {
            sticker.style.backgroundColor = color;
            sticker.innerHTML =
              '<textarea placeholder="Type here..." rows="4"></textarea>' +
              '<button class="sticker__delete" aria-label="Remove">\u2715</button>';
          } else {
            sticker.textContent = emoji;
            var deleteBtn = document.createElement('button');
            deleteBtn.classList.add('sticker__delete');
            deleteBtn.setAttribute('aria-label', 'Remove');
            deleteBtn.textContent = '\u2715';
            sticker.appendChild(deleteBtn);
          }

          stickerCanvas.appendChild(sticker);

          // Delete single sticker
          sticker.querySelector('.sticker__delete').addEventListener('click', (e) => {
            e.stopPropagation();
            removeSticker(sticker);
          });

          makeDraggable(sticker);
        }
        item.addEventListener('click', placeSticker);
        item.addEventListener('keydown', onKeyActivate(placeSticker));
      });
    }
  };
})();
