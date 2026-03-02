/* =========================================
   Shared Gyroscope Module
   Normalizes device tilt to 0-1 values
   ========================================= */

window.Gyroscope = {
  x: 0.5,
  y: 0.5,
  supported: false,
  active: false,
  listeners: [],

  on: function (fn) {
    this.listeners.push(fn);
  },

  off: function (fn) {
    this.listeners = this.listeners.filter(function (l) { return l !== fn; });
  },

  deactivate: function () {
    this.active = false;
    this.x = 0.5;
    this.y = 0.5;
  },

  init: async function () {
    var self = this;

    // Already active
    if (self.active) return true;

    // Check basic support
    if (!window.DeviceOrientationEvent) return false;

    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        var permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') return false;
      } catch (e) {
        return false;
      }
    }

    self.supported = true;
    self.active = true;

    window.addEventListener('deviceorientation', function (e) {
      if (!self.active) return;

      // beta: front/back tilt (-90 to 90), map to y (0-1)
      // gamma: left/right tilt (-45 to 45), map to x (0-1)
      var beta = e.beta != null ? e.beta : 0;
      var gamma = e.gamma != null ? e.gamma : 0;

      // Clamp ranges
      beta = Math.max(-90, Math.min(90, beta));
      gamma = Math.max(-45, Math.min(45, gamma));

      // Normalize to 0-1
      self.x = (gamma + 45) / 90;
      self.y = (beta + 90) / 180;

      // Broadcast
      for (var i = 0; i < self.listeners.length; i++) {
        self.listeners[i](self.x, self.y);
      }
    });

    return true;
  }
};
