/*!
 * v-touch -- A full-featured gesture component designed for Vue
 * Version 1.1.0
 * 
 * Copyright (C) 2016-2017 JounQin <admin@1stg.me>
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

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(1);


var MOUSE_DOWN = 'mousedown';
var MOUSE_MOVE = 'mousemove';
var MOUSE_UP = 'mouseup';

var EVENTS = {
  start: 'touchstart ' + MOUSE_DOWN,
  move: 'touchmove',
  end: 'touchend touchcancel'
};

var DEFAULT_OPTIONS = {
  methods: false
};

var actualEvent = function actualEvent(e, prevent, stop) {
  prevent && e.preventDefault && e.preventDefault();
  stop && e.stopPropagation && e.stopPropagation();
  var touches = e.changedTouches;
  return {
    event: touches ? touches[0] : e,
    support: !!touches
  };
};

function init(el, _ref) {
  var _this = this;

  var value = _ref.value,
      _ref$modifiers = _ref.modifiers,
      prevent = _ref$modifiers.prevent,
      stop = _ref$modifiers.stop;

  var isPrevent = function isPrevent(event) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return event && event.apply(_this, params) === false;
  };

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

  el.eMove = function (e) {
    if (!el._startTime || el._doNotMove) return;

    e = actualEvent(e, prevent, stop).event;

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
  };

  el.eEnd = function (e) {
    if (e.type === MOUSE_UP) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* off */])(document, MOUSE_MOVE, el.eMove);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* off */])(document, MOUSE_UP, el.eEnd);
    }

    if (!el._startTime) return;

    var actual = actualEvent(e, prevent, stop);
    e = actual.event;

    var _clientX = el._clientX,
        _clientY = el._clientY,
        _moved = el._moved,
        _startTime = el._startTime;


    delete el._clientX;
    delete el._clientY;
    delete el._doNotMove;
    delete el._moved;
    delete el._moveStarted;
    delete el._startTime;

    var endEvent = wrapEvent(e);

    if (_moved) {
      var changedX = e.clientX - _clientX;
      var changedY = e.clientY - _clientY;

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

    var duration = +new Date() - _startTime;

    el._tapped = el._tapped + 1 || 1;

    if (duration > 200) return isPrevent(press, endEvent) && isPrevent(end, endEvent);

    el._timeout = setTimeout(function () {
      var tapped = el._tapped;

      delete el._tapped;
      delete el._timeout;

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

        if (actual.support && e.target.dispatchEvent(new Event(prefix + 'click', eventInit)) === false) return;

        if (e.target.dispatchEvent(new Event(prefix + 'tap', eventInit)) === false) return;
      } else if (isPrevent(mltTap, Object.assign(endEvent, { tapped: tapped }))) return;
      isPrevent(end, endEvent);
    }, 200);
  };

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* on */])(el, EVENTS.start, el.eStart = function (e) {
    clearTimeout(el._timeout);

    var isMouseDown = e.type === MOUSE_DOWN;

    if (isMouseDown) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* on */])(document, MOUSE_MOVE, el.eMove);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* on */])(document, MOUSE_UP, el.eEnd);
    }

    e = actualEvent(e, isMouseDown ? prevent : true, stop).event;

    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _startTime: +new Date()
    });

    isPrevent(start, wrapEvent(e)) && (el._doNotMove = true);
  });

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* on */])(el, EVENTS.move, el.eMove);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* on */])(el, EVENTS.end, el.eEnd);
}

function destroy(el) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* off */])(el, EVENTS.start, el.eStart);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* off */])(el, EVENTS.move, el.eMove);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* off */])(el, EVENTS.end, el.eEnd);
}

/* harmony default export */ exports["a"] = {
  bind: function bind(el, binding, vnode) {
    var context = vnode.context;

    init.call(context, el, binding);
  },

  unbind: destroy
};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return off; });
var on = function on(el, event, handler) {
  return el.addEventListener(event, handler, false);
};
var off = function off(el, event, handler) {
  return el.removeEventListener(event, handler, false);
};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__touch__ = __webpack_require__(0);


var installed = false;

var VTouch = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (installed) return;
    installed = true;
    Vue.directive(options.name || 'touch', __WEBPACK_IMPORTED_MODULE_0__touch__["a" /* default */]);
  }
};

typeof window !== 'undefined' && window.Vue && window.Vue.use(VTouch);

/* harmony default export */ exports["default"] = VTouch;

/***/ }
/******/ ]);
});