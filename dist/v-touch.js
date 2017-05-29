/*!
 * v-touch -- A full-featured gesture component designed for Vue
 * Version 1.3.0
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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utils__);


var MOUSE_DOWN = 'mousedown';
var MOUSE_MOVE = 'mousemove';
var MOUSE_UP = 'mouseup';

var EVENTS = {
  start: 'touchstart ' + MOUSE_DOWN,
  move: 'touchmove',
  end: 'touchend touchcancel'
};

var DEFAULT_OPTIONS = {
  methods: false,
  enable: true
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

var findLinkNode = function findLinkNode(el, _ref) {
  var target = _ref.target;

  var node = target;
  do {
    if (node.tagName.toLowerCase() === 'a') return node;
    if (node === el) return;
    node = node.parentNode;
  } while (node !== el);
};

function init(el, _ref2) {
  var _this = this;

  var value = _ref2.value,
      _ref2$modifiers = _ref2.modifiers,
      prevent = _ref2$modifiers.prevent,
      stop = _ref2$modifiers.stop;

  var isPrevent = function isPrevent(event, e) {
    if (!event) return;
    return event.call(_this, e) === false || e.returnValue === false;
  };

  value = Object.assign({}, DEFAULT_OPTIONS, value);

  if (!value.enable) return;

  var _ref3 = value.methods ? this : value,
      start = _ref3.start,
      moveStart = _ref3.moveStart,
      moving = _ref3.moving,
      moveEnd = _ref3.moveEnd,
      end = _ref3.end,
      tap = _ref3.tap,
      dblTap = _ref3.dblTap,
      mltTap = _ref3.mltTap,
      press = _ref3.press,
      pressing = _ref3.pressing,
      swipeLeft = _ref3.swipeLeft,
      swipeRight = _ref3.swipeRight,
      swipeUp = _ref3.swipeUp,
      swipeDown = _ref3.swipeDown;

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

  var removeInterval = function removeInterval() {
    return el._interval && (clearInterval(el._interval) || delete el._interval);
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

    if (!el._moveStarted) return;

    removeInterval();

    isPrevent(moving, Object.assign(wrappedEvent, { changedX: changedX, changedY: changedY }));
  };

  el.eEnd = function (e) {
    removeInterval();

    if (e.type === MOUSE_UP) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["off"])(document, MOUSE_MOVE, el.eMove);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["off"])(document, MOUSE_UP, el.eEnd);
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

        var link = isSingle && findLinkNode(el, e);

        var _click = void 0;

        if (link) {
          _click = link._click = true;
          link.click();
        }

        var eventInit = {
          bubbles: true,
          cancelable: true,
          cancelBubble: true
        };

        var prefix = isSingle ? '' : 'dbl';

        if (actual.support && (!isSingle || !_click)) {
          var clickEv = new Event(prefix + 'click', eventInit);
          var _e2 = e,
              target = _e2.target;

          target.dispatchEvent(clickEv);
          if (clickEv.returnValue === false) return;
        }

        var tapEv = new Event(prefix + 'tap', eventInit);

        e.target.dispatchEvent(tapEv);

        if (tapEv.returnValue === false) return;
      } else if (isPrevent(mltTap, Object.assign(endEvent, { tapped: tapped }))) return;
      isPrevent(end, endEvent);
    }, 200);
  };

  el.eStart = function (e) {
    clearTimeout(el._timeout);
    removeInterval();

    var isMouseDown = e.type === MOUSE_DOWN;

    if (isMouseDown) {
      e.target.tagName.toLowerCase() === 'img' && e.preventDefault();
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(document, MOUSE_MOVE, el.eMove);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(document, MOUSE_UP, el.eEnd);
    }

    e = actualEvent(e, isMouseDown ? prevent : true, stop).event;

    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _startTime: +new Date()
    });

    var wrappedEvent = wrapEvent(e);

    isPrevent(start, wrappedEvent) && (el._doNotMove = true);

    el._interval = setInterval(function () {
      return el._startTime ? isPrevent(pressing, wrappedEvent) : removeInterval();
    }, 200);
  };

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(el, EVENTS.start, el.eStart);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(el, EVENTS.move, el.eMove);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(el, EVENTS.end, el.eEnd);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["on"])(el, 'click', function (e) {
    var link = findLinkNode(el, e);
    if (!link) return;
    link._click ? delete link._click : e.preventDefault();
  });
}

function destroy(el) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["off"])(el, EVENTS.start, el.eStart);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["off"])(el, EVENTS.move, el.eMove);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["off"])(el, EVENTS.end, el.eEnd);
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bind: function bind(el, binding, vnode) {
    var context = vnode.context;

    init.call(context, el, binding);
  },

  unbind: destroy
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/* harmony default export */ __webpack_exports__["default"] = (VTouch);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

['on', 'off'].forEach(function (val, index) {
  module.exports[val] = function (el, events, handler) {
    return events.trim().split(' ').forEach(function (event) {
      return event && el[(index ? 'remove' : 'add') + 'EventListener'](event, handler, false);
    });
  };
});

/***/ })
/******/ ]);
});