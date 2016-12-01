/*!
 * v-touch -- A full-featured gesture component designed for Vue
 * Version 1.0.6
 * 
 * Copyright (C) 2016 JounQin <admin@1stg.me>
 * Released under the MIT license
 * 
 * Github: https://github.com/JounQin/v-touch
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VTouch"] = factory();
	else
		root["VTouch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isTouchSupport = function isTouchSupport() {
  return !!('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/) || window.DocumentTouch && document instanceof window.DocumentTouch || window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0 || window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0 || false);
};

var BASE_EVENTS = [{
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}];

var DEFAULT_OPTIONS = {
  methods: false
};

var touchSupport = void 0,
    EVENTS = void 0;

var actualEvent = function actualEvent(e, prevent, stop) {
  prevent && e.preventDefault && e.preventDefault();
  stop && e.stopPropagation && e.stopPropagation();
  return touchSupport && e.changedTouches ? e.changedTouches[0] : e;
};

var tapTimeoutId = void 0;
var isPreventFunc = function isPreventFunc(context) {
  return function (event) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return event && event.apply(context, params) === false;
  };
};

function init(el, _ref) {
  var value = _ref.value,
      _ref$modifiers = _ref.modifiers,
      prevent = _ref$modifiers.prevent,
      stop = _ref$modifiers.stop;

  var isPrevent = isPreventFunc(this);
  value = Object.assign({}, DEFAULT_OPTIONS, value);

  var _ref2 = value.methods ? this : value,
      start = _ref2.start,
      moveStart = _ref2.moveStart,
      moving = _ref2.moving,
      moveEnd = _ref2.moveEnd,
      end = _ref2.end,
      tap = _ref2.tap,
      dblTap = _ref2.dblTap,
      mltTap = _ref2.mltTap,
      press = _ref2.press,
      swipeLeft = _ref2.swipeLeft,
      swipeRight = _ref2.swipeRight,
      swipeUp = _ref2.swipeUp,
      swipeDown = _ref2.swipeDown;

  var $el = touchSupport ? el : document;
  var wrapEvent = function wrapEvent(e) {
    return Object.defineProperties(e, {
      currentTarget: {
        value: el,
        readable: true,
        writable: true,
        enumerable: true,
        configurable: true
      }
    });
  };

  _utils2.default.on(el, EVENTS.start, el.eStart = function (e) {
    clearTimeout(tapTimeoutId);

    e = actualEvent(e, true, stop);
    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _startTime: +new Date()
    });
    isPrevent(start, wrapEvent(e)) && (el._doNotMove = true);
  }).on($el, EVENTS.move, el.eMove = function (e) {
    if (!el._startTime || el._doNotMove) return;
    e = actualEvent(e, prevent, stop);

    var _e = e,
        clientX = _e.clientX,
        clientY = _e.clientY;
    var originalClientX = el._clientX,
        originalClientY = el._clientY;


    var changedX = clientX - originalClientX;
    var changedY = clientY - originalClientY;

    if (Math.abs(changedX) > 5 || Math.abs(changedY) > 5) el._moved = true;

    var wrappedEvent = wrapEvent(e);

    if (el._moved && !el._moveStarted) {
      if (isPrevent(moveStart, wrappedEvent)) return;
      el._moveStarted = true;
    }

    el._moveStarted && isPrevent(moving, Object.assign(wrappedEvent, {
      changedX: changedX,
      changedY: changedY
    }));
  }).on($el, EVENTS.end, el.eEnd = function (e) {
    if (!el._startTime) return;
    e = actualEvent(e, prevent, stop);

    var clientX = el._clientX,
        clientY = el._clientY,
        moved = el._moved,
        startTime = el._startTime;


    delete el._clientX;
    delete el._clientY;
    delete el._doNotMove;
    delete el._moved;
    delete el._moveStarted;
    delete el._startTime;

    var endEvent = wrapEvent(e);

    if (moved) {
      var changedX = e.clientX - clientX;
      var changedY = e.clientY - clientY;

      Object.assign(endEvent, { changedX: changedX, changedY: changedY });

      if (isPrevent(moveEnd, endEvent)) return;

      var absChangedX = Math.abs(changedX);
      var absChangedY = Math.abs(changedY);

      var event = void 0;
      if (absChangedX < 20) {
        if (changedY > 50) {
          event = swipeDown;
        } else if (changedY < -50) {
          event = swipeUp;
        }
      } else if (absChangedY < 20) {
        if (changedX > 50) {
          event = swipeRight;
        } else if (changedX < -50) {
          event = swipeLeft;
        }
      }
      if (isPrevent(event, endEvent)) return;

      return isPrevent(end, endEvent);
    }

    var duration = +new Date() - startTime;
    el._tapped = el._tapped + 1 || 1;

    if (duration > 200) return isPrevent(press, endEvent) && isPrevent(end, endEvent);

    tapTimeoutId = setTimeout(function () {
      var tapped = el._tapped;
      delete el._tapped;
      if (tapped < 3) {
        var isSingle = tapped === 1;
        var tapEvent = isSingle ? tap : dblTap;
        if (isPrevent(tapEvent, endEvent)) return;
        var eventInit = {
          bubbles: true,
          cancelable: true,
          cancelBubble: true
        };
        var prefix = isSingle ? '' : 'dbl';
        if (touchSupport && e.target.dispatchEvent(new Event(prefix + 'click', eventInit)) === false) return;
        if (e.target.dispatchEvent(new Event(prefix + 'tap', eventInit)) === false) return;
      } else if (isPrevent(mltTap, Object.assign(endEvent, { tapped: tapped }))) return;
      isPrevent(end, endEvent);
    }, 200);
  });
}

function destroy(el, binding) {
  var $el = touchSupport ? el : document;
  _utils2.default.off(el, EVENTS.start, el.eStart).off($el, EVENTS.move, el.eMove).off($el, EVENTS.end, el.eEnd);
  binding === true || _utils2.default.off(window, 'resize', el.eResize);
}

var resizeTimeoutId = void 0;

exports.default = {
  bind: function bind(el, binding, vnode) {
    touchSupport = isTouchSupport();
    EVENTS = BASE_EVENTS[+touchSupport];
    var context = vnode.context;

    init.call(context, el, binding);

    _utils2.default.on(window, 'resize', el.eResize = function () {
      clearTimeout(resizeTimeoutId);

      resizeTimeoutId = setTimeout(function () {
        var newTouchSupport = isTouchSupport();
        if (touchSupport === newTouchSupport) return;
        destroy.call(context, el, true);
        touchSupport = newTouchSupport;
        EVENTS = BASE_EVENTS[+touchSupport];
        init.call(context, el, binding);
      }, 300);
    });
  },

  unbind: destroy
};
module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  on: function on(el, event, handler) {
    el.addEventListener(event, handler, false);
    return this;
  },
  off: function off(el, event, handler) {
    el.removeEventListener(event, handler, false);
    return this;
  }
};
module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _touch = __webpack_require__(0);

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var installed = false;

var VTouch = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (installed) return;
    installed = true;
    Vue.directive(options.name || 'touch', _touch2.default);
  }
};

window.Vue && window.Vue.use(VTouch);

exports.default = VTouch;
module.exports = exports['default'];

/***/ }
/******/ ])
});
;