/*!
  *  v-touch -- A full-featured gesture component designed for Vue
  *  GitHub: https://github.com/JounQin/v-touch
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('v-touch', factory) :
  (global.VTouch = factory());
}(this, (function () { 'use strict';

var utils = {
  on(el, events, handler, useCapture = false) {
    events.trim().split(' ').forEach(event => el.addEventListener(event, handler, useCapture));
    return this
  },
  off(el, events, handler, useCapture = false) {
    events.trim().split(' ').forEach(event => el.removeEventListener(event, handler, useCapture));
    return this
  }
};

const touchSupport = !!(('ontouchstart' in window &&
navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
(window.DocumentTouch && document instanceof window.DocumentTouch) ||
(window.navigator['msPointerEnabled'] &&
window.navigator['msMaxTouchPoints'] > 0) || // IE 10
(window.navigator['pointerEnabled'] &&
window.navigator['maxTouchPoints'] > 0) || // IE >=11
false);

const actualEvent = e => touchSupport ? e.changedTouches[0] : e;

const EVENTS = {
  start: 'mousedown touchstart',
  move: 'mousemove touchmove',
  end: 'mouseup touchend'
};

const EMPTY_FUNC = () => {};

const handler = {};

['start', 'moveStart', 'moving', 'moveEnd', 'end',
  'tap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown']
  .forEach(event => handler[event] = EMPTY_FUNC); // eslint-disable-line no-return-assign

const DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1
};

var touch = {
  bind(el, binding) {
    const value = binding.value;
    Object.assign({}, DEFAULT_OPTIONS, value);
    const events = Object.assign({}, EVENTS, value.events);
    const handler = Object.assign({}, handler, value.handler);

    const $el = touchSupport ? el : document;

    utils.on($el, events.start, e => {
      // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
      e.preventDefault();
      handler.start.call(this, actualEvent(e));
    }).on($el, events.move, e => {
      e = actualEvent(e);
      handler.moveStart.call(this, e);
      handler.moving.call(this, e);
      handler.moveEnd.call(this, e);
    }).on($el, events.end, e => {
      e = actualEvent(e);
      handler.end.call(this, e);
    });
  }
};

let installed = false;

var index = {
  install(Vue, options = {}) {
    if (installed) return
    installed = true;
    Vue.directive(options.name || 'touch', touch);
  }
};

return index;

})));
