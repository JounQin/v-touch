/*!
 * v-touch -- A full-featured gesture component designed for Vue
 * Version 1.4.1
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
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./lib/touch.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utils__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



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

var MOUSE_EVENT_PROPS = ['altKey', 'button', 'buttons', 'clientX', 'clientY', 'ctrlKey', 'metaKey', 'movementX', 'movementY', 'region', 'relatedTarget', 'screenX', 'screenY', 'shiftKey', 'which'];

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

  var isPrevent = function isPrevent(event, e) {
    if (!event) return;
    return event.call(_this, e) === false || e.returnValue === false;
  };

  value = Object.assign({}, DEFAULT_OPTIONS, value);

  if (!value.enable) return;

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
      pressing = _ref2.pressing,
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
      __WEBPACK_IMPORTED_MODULE_0__utils__["off"](document, MOUSE_MOVE, el.eMove);
      __WEBPACK_IMPORTED_MODULE_0__utils__["off"](document, MOUSE_UP, el.eEnd);
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

        var eventInit = _extends({
          bubbles: true,
          cancelable: true,
          cancelBubble: true
        }, MOUSE_EVENT_PROPS.reduce(function (event, prop) {
          event[prop] = e[prop];
          return event;
        }, {}));

        var prefix = isSingle ? '' : 'dbl';

        var clickEv = new MouseEvent(prefix + 'click', eventInit);
        isSingle && (clickEv._click = true);

        var _e2 = e,
            target = _e2.target;

        if (target.dispatchEvent(clickEv) === false || clickEv.returnValue === false) return;

        var tapEv = new MouseEvent(prefix + 'tap', eventInit);

        if (e.target.dispatchEvent(tapEv) === false || tapEv.returnValue === false) return;
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
      __WEBPACK_IMPORTED_MODULE_0__utils__["on"](document, MOUSE_MOVE, el.eMove);
      __WEBPACK_IMPORTED_MODULE_0__utils__["on"](document, MOUSE_UP, el.eEnd);
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

  el.eClick = function (e) {
    if (e._click) return delete e._click;
    e.preventDefault();
    e.stopPropagation();
  };

  __WEBPACK_IMPORTED_MODULE_0__utils__["on"](el, EVENTS.start, el.eStart);
  __WEBPACK_IMPORTED_MODULE_0__utils__["on"](el, EVENTS.move, el.eMove);
  __WEBPACK_IMPORTED_MODULE_0__utils__["on"](el, EVENTS.end, el.eEnd);
  __WEBPACK_IMPORTED_MODULE_0__utils__["on"](el, 'click', el.eClick);
}

function destroy(el) {
  __WEBPACK_IMPORTED_MODULE_0__utils__["off"](el, EVENTS.start, el.eStart);
  __WEBPACK_IMPORTED_MODULE_0__utils__["off"](el, EVENTS.move, el.eMove);
  __WEBPACK_IMPORTED_MODULE_0__utils__["off"](el, EVENTS.end, el.eEnd);
  __WEBPACK_IMPORTED_MODULE_0__utils__["off"](el, 'click', el.eClick);
}

/* harmony default export */ var touch_defaultExport = ({
  bind: function bind(el, binding, vnode) {
    var context = vnode.context;

    init.call(context, el, binding);
  },

  unbind: destroy
});
// CONCATENATED MODULE: ./lib/index.js


var installed = false;

var VTouch = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (installed) return;
    installed = true;
    Vue.directive(options.name || 'touch', touch_defaultExport);
  }
};

typeof window !== 'undefined' && window.Vue && window.Vue.use(VTouch);

/* harmony default export */ __webpack_exports__["default"] = (VTouch);

/***/ }),
/* 1 */
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