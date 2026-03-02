/* =========================================
   Drawing Tool — Pencil & Marker
   Lives inside the "Make a mess" sticker tray
   ========================================= */

(function () {
  window.initDraw = function () {
    var canvas = document.getElementById('drawCanvas');
    var mainContent = document.getElementById('mainContent');
    var drawPencil = document.getElementById('drawPencil');
    var drawMarker = document.getElementById('drawMarker');
    var drawColors = document.getElementById('drawColors');
    var drawClear = document.getElementById('drawClear');
    var thicknessSlider = document.getElementById('drawThickness');

    if (!canvas || !mainContent) return;

    var ctx = canvas.getContext('2d');
    var toolBtns = [drawPencil, drawMarker].filter(Boolean);

    // --- State ---
    var isDrawing = false;
    var currentTool = null; // null = inactive, 'pencil' or 'marker'
    var currentColor = '#0a0a0a';
    var currentThickness = 3;
    var MARKER_COLOR = '#f59e0b';

    // --- Canvas sizing ---
    function resizeCanvas() {
      var imageData = null;
      if (canvas.width > 0 && canvas.height > 0) {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      var dpr = window.devicePixelRatio || 1;
      var w = mainContent.scrollWidth;
      var h = mainContent.scrollHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (imageData) {
        ctx.putImageData(imageData, 0, 0);
      }
    }

    resizeCanvas();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    });

    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    }) : null;
    if (ro) ro.observe(mainContent);

    // --- Activate / deactivate drawing ---
    function setActiveTool(tool) {
      if (currentTool === tool) {
        // Toggle off
        currentTool = null;
        document.body.classList.remove('draw-active', 'draw-marker');
        toolBtns.forEach(function (b) { b.classList.remove('sticker-tray__item--active'); });
        return;
      }

      currentTool = tool;
      document.body.classList.add('draw-active');
      document.body.classList.toggle('draw-marker', tool === 'marker');

      toolBtns.forEach(function (b) {
        b.classList.toggle('sticker-tray__item--active', b.dataset.tool === tool);
      });
    }

    function deactivateDraw() {
      currentTool = null;
      document.body.classList.remove('draw-active', 'draw-marker');
      toolBtns.forEach(function (b) { b.classList.remove('sticker-tray__item--active'); });
    }

    // Expose for other modules (settings, sticker tray close)
    window.closeDrawMenu = deactivateDraw;

    // --- Tool button clicks ---
    toolBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setActiveTool(btn.dataset.tool);
      });
    });

    // --- Drawing ---
    function getPos(e) {
      var rect = mainContent.getBoundingClientRect();
      var x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left + mainContent.scrollLeft;
      var y = (e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top + mainContent.scrollTop;
      return { x: x, y: y };
    }

    function applyToolSettings() {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentTool === 'marker') {
        ctx.strokeStyle = MARKER_COLOR;
        ctx.lineWidth = currentThickness * 5;
        ctx.globalAlpha = 0.12;
      } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.globalAlpha = 1;
      }
    }

    function onPointerDown(e) {
      if (!currentTool) return;
      isDrawing = true;
      applyToolSettings();
      var pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
      ctx.stroke();
    }

    function onPointerMove(e) {
      if (!isDrawing) return;
      e.preventDefault();
      var pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function onPointerUp() {
      if (!isDrawing) return;
      isDrawing = false;
      ctx.closePath();
      ctx.globalAlpha = 1;
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    canvas.addEventListener('touchstart', function (e) {
      if (currentTool) e.preventDefault();
    }, { passive: false });

    // --- Color selection (pencil only — marker is always yellow) ---
    if (drawColors) {
      drawColors.querySelectorAll('.draw-tool__color').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          drawColors.querySelectorAll('.draw-tool__color').forEach(function (b) {
            b.classList.remove('draw-tool__color--active');
          });
          btn.classList.add('draw-tool__color--active');
          currentColor = btn.dataset.color;
        });
      });
    }

    // --- Thickness ---
    if (thicknessSlider) {
      thicknessSlider.addEventListener('input', function () {
        currentThickness = parseInt(thicknessSlider.value, 10);
      });
      thicknessSlider.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // --- Clear ---
    if (drawClear) {
      var onClear = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
      drawClear.addEventListener('click', onClear);
      drawClear.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClear();
        }
      });
    }
  };
})();
