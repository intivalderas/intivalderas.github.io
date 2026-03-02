/* =========================================
   Draggable & Resizable Stickers & Post-its
   ========================================= */

(function () {
  function makeDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onStart = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' ||
          e.target.classList.contains('sticker__resize')) return;
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

  function makeResizable(el) {
    const handle = el.querySelector('.sticker__resize');
    if (!handle) return;

    let isResizing = false;
    let startX, startY, startWidth, startHeight, startFontSize;

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });

    function onStart(e) {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startY = e.touches ? e.touches[0].clientY : e.clientY;

      if (el.classList.contains('sticker--postit')) {
        startWidth = el.offsetWidth;
        startHeight = el.offsetHeight;
      } else {
        startFontSize = parseFloat(getComputedStyle(el).fontSize);
      }

      el.style.transition = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
      if (!isResizing) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const delta = (dx + dy) / 2;

      if (el.classList.contains('sticker--postit')) {
        el.style.width = Math.max(100, startWidth + dx) + 'px';
        el.style.minHeight = Math.max(60, startHeight + dy) + 'px';
      } else {
        var newSize = Math.max(1, startFontSize + delta * 0.15);
        el.style.fontSize = newSize + 'rem';
      }
    }

    function onEnd() {
      isResizing = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    }
  }

  function removeSticker(sticker) {
    sticker.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    sticker.style.transform = 'scale(0) rotate(20deg)';
    sticker.style.opacity = '0';
    setTimeout(() => sticker.remove(), 300);
  }

  // Pick a random position spread across the visible main content area
  function randomPosition() {
    var main = document.getElementById('mainContent');
    var mainRect = main ? main.getBoundingClientRect() : { left: 0, width: window.innerWidth };
    var contentLeft = mainRect.left;
    var contentWidth = mainRect.width;

    // Horizontal: spread across 90% of main content width
    var padX = contentWidth * 0.05;
    var x = contentLeft + padX + Math.random() * (contentWidth - padX * 2);

    // Vertical: spread across the full visible viewport height
    var padY = 60;
    var y = window.scrollY + padY + Math.random() * (window.innerHeight - padY * 2);

    return { x: x, y: y };
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

    // Toggle tray — also close settings if open
    if (stickerToggle) {
      const toggleTray = () => {
        var settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
          settingsPanel.classList.remove('settings__panel--open');
          var st = document.getElementById('settingsToggle');
          if (st) st.setAttribute('aria-expanded', 'false');
        }
        stickerTray.classList.toggle('sticker-tray--open');
        var isOpen = stickerTray.classList.contains('sticker-tray--open');
        stickerToggle.setAttribute('aria-expanded', String(isOpen));
        // Deactivate drawing when closing the tray
        if (!isOpen && window.closeDrawMenu) window.closeDrawMenu();
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
      stickerItems.querySelectorAll('.sticker-tray__item:not(.sticker-tray__clear):not(.sticker-tray__item--draw)').forEach(item => {
        const placeSticker = () => {
          const type = item.dataset.type || 'emoji';
          const emoji = item.dataset.sticker;
          const color = item.dataset.color || '#fef3c7';
          const rotation = (Math.random() - 0.5) * 8;

          const sticker = document.createElement('div');
          sticker.classList.add('sticker', type === 'postit' ? 'sticker--postit' : 'sticker--emoji');
          sticker.style.setProperty('--rotation', rotation + 'deg');

          var pos = randomPosition();
          sticker.style.left = pos.x + 'px';
          sticker.style.top = pos.y + 'px';

          // Resize handle
          var resizeHandle = document.createElement('div');
          resizeHandle.classList.add('sticker__resize');
          resizeHandle.setAttribute('aria-hidden', 'true');

          if (type === 'postit') {
            sticker.style.backgroundColor = color;
            sticker.innerHTML =
              '<textarea placeholder="Type here..." rows="4"></textarea>' +
              '<button class="sticker__delete" aria-label="Remove">\u2715</button>';
            sticker.appendChild(resizeHandle);
          } else {
            sticker.textContent = emoji;
            var deleteBtn = document.createElement('button');
            deleteBtn.classList.add('sticker__delete');
            deleteBtn.setAttribute('aria-label', 'Remove');
            deleteBtn.textContent = '\u2715';
            sticker.appendChild(deleteBtn);
            sticker.appendChild(resizeHandle);
          }

          stickerCanvas.appendChild(sticker);

          // Delete single sticker
          sticker.querySelector('.sticker__delete').addEventListener('click', (e) => {
            e.stopPropagation();
            removeSticker(sticker);
          });

          makeDraggable(sticker);
          makeResizable(sticker);

          // Gyroscope wobble on mobile
          if (window.Gyroscope && Gyroscope.active) {
            Gyroscope.on(function (gx, gy) {
              if (!sticker.parentNode) return;
              var rot = (gx - 0.5) * 6;
              var tx = (gx - 0.5) * 10;
              var ty = (gy - 0.5) * 6;
              var baseRot = parseFloat(sticker.style.getPropertyValue('--rotation')) || 0;
              sticker.style.transform = 'rotate(' + (baseRot + rot) + 'deg) translate(' + tx + 'px, ' + ty + 'px)';
            });
          }
        };
        item.addEventListener('click', placeSticker);
        item.addEventListener('keydown', onKeyActivate(placeSticker));
      });
    }
  };
})();
