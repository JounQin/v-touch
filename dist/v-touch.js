/*!  @license
  *  v-touch -- A full-featured gesture component designed for Vue
  *  GitHub: https://github.com/JounQin/v-touch
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('v-touch', factory) :
  (global.VTouch = factory());
}(this, (function () { 'use strict';

var utils = {
  on: function on(el, events, handler) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    events.trim().split(' ').forEach(function (event) {
      return el.addEventListener(event, handler, useCapture);
    });
    return this;
  },
  off: function off(el, events, handler) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    events.trim().split(' ').forEach(function (event) {
      return el.removeEventListener(event, handler, useCapture);
    });
    return this;
  }
};
module.exports = exports['default'];

var touchSupport = !!('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/) || window.DocumentTouch && document instanceof window.DocumentTouch || window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0 || window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0 || false);

var actualEvent = function actualEvent(e) {
  return touchSupport ? e.changedTouches[0] : e;
};

var EVENTS = [{
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}][+touchSupport];

var EMPTY_FUNC = function EMPTY_FUNC() {};

var handler = {};

['start', 'moveStart', 'moving', 'moveEnd', 'end', 'tap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'].forEach(function (event) {
  return handler[event] = EMPTY_FUNC;
});

var DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1
};

var touch = {
  bind: function bind(el, binding) {
    var _this = this;

    var value = binding.value;
    Object.assign({}, DEFAULT_OPTIONS, value);
    var handler = Object.assign({}, handler, value.handler);
    var $el = touchSupport ? el : document;
    utils.on($el, EVENTS.start, function (e) {
      e.preventDefault();
      handler.start.call(_this, actualEvent(e));
    }).on($el, EVENTS.move, function (e) {
      e = actualEvent(e);
      handler.moveStart.call(_this, e);
      handler.moving.call(_this, e);
      handler.moveEnd.call(_this, e);
    }).on($el, EVENTS.end, function (e) {
      e = actualEvent(e);
      handler.end.call(_this, e);
    });
  }
};
module.exports = exports['default'];

var installed = false;

var index = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (installed) return;
    installed = true;
    Vue.directive(options.name || 'touch', touch);
  }
};
module.exports = exports['default'];

return index;

})));
