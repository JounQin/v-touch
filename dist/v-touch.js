/*!
 * v-touch -- A full-featured gesture component designed for Vue
 * Version 0.1.1
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var trueType = exports.trueType = function trueType(value) {
  return [].slice.call({}.toString.call(value), 8, -1).join('');
};

var trueTypeFunc = exports.trueTypeFunc = function trueTypeFunc(type) {
  return function (value) {
    return type === trueType(value);
  };
};

['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function', 'Map', 'Null', 'Object', 'RegExp', 'Set', 'String', 'Symbol', 'Undefined'].forEach(function (type) {
  return module.exports['is' + type] = trueTypeFunc(type);
});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var modulesContext = __webpack_require__(4);

exports.default = modulesContext.keys().reduce(function (modules, key) {
  return Object.assign(modules, modulesContext(key));
}, {});
module.exports = exports['default'];

/***/ },
/* 2 */
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

var touchSupport = isTouchSupport();

var BASE_EVENTS = [{
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}];

var EVENTS = BASE_EVENTS[+touchSupport];

var EMPTY_FUNC = function EMPTY_FUNC() {};
var HANDLER = {};

['start', 'moveStart', 'moving', 'moveEnd', 'end', 'tap', 'dbTap', 'press', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'].forEach(function (event) {
  return HANDLER[event] = EMPTY_FUNC;
});

var DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1
};

var actualEvent = function actualEvent(e, prevent, stop) {
  prevent && e.preventDefault && e.preventDefault();
  stop && e.stopPropagation && e.stopPropagation();
  return touchSupport ? e.changedTouches[0] : e;
};

var tapTimeoutId = void 0;

function init(el, _ref) {
  var _this = this;

  var value = _ref.value,
      _ref$modifiers = _ref.modifiers,
      prevent = _ref$modifiers.prevent,
      stop = _ref$modifiers.stop;

  value = Object.assign({}, DEFAULT_OPTIONS, value);
  var handler = Object.assign({}, HANDLER, value.handler);
  var $el = touchSupport ? el : document;
  var eventParam = Object.create({}, { currentTarget: { value: el, writable: false } });
  var wrapEvent = function wrapEvent(e, params) {
    return Object.assign(e, eventParam, params);
  };
  _utils2.default.on(el, EVENTS.start, el.eStart = function (e) {
    clearTimeout(tapTimeoutId);

    e = actualEvent(e, true, stop);
    if (handler.start.call(_this, wrapEvent(e)) === false) el._doNotMove = true;
    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _translate: (0, _utils.getTranslate)(el),
      _startTime: +new Date()
    });
  }).on($el, EVENTS.move, el.eMove = function (e) {
    var originalTranslate = el._translate;
    if (!originalTranslate || el._doNotMove) return;
    e = actualEvent(e, prevent, stop);

    var _e = e,
        clientX = _e.clientX,
        clientY = _e.clientY;
    var originalClientX = el._clientX,
        originalClientY = el._clientY;
    var originalTranslateX = originalTranslate.x,
        originalTranslateY = originalTranslate.y;


    var changedX = clientX - originalClientX;
    var changedY = clientY - originalClientY;

    if (Math.abs(changedX) > 5 || Math.abs(changedY) > 5) el._moved = true;

    if (el._moved && !el._moveStarted) {
      if (handler.moveStart.call(_this, wrapEvent(e)) === false) return;
      el._moveStarted = true;
    }

    var translateX = value.x ? originalTranslateX + value.speed * changedX : originalTranslateX;
    var translateY = value.y ? originalTranslateY + value.speed * changedY : originalTranslateY;

    var movingEvent = wrapEvent(e, {
      translateX: translateX,
      translateY: translateY,
      changedX: changedX,
      changedY: changedY
    });

    if (handler.moving.call(_this, movingEvent) === false) return;
    translateX = movingEvent.translateX;
    translateY = movingEvent.translateY;

    (0, _utils.translate)(el, translateX, translateY);
  }).on($el, EVENTS.end, el.eEnd = function (e) {
    e = actualEvent(e, prevent, stop);

    var clientX = el._clientX,
        clientY = el._clientY,
        translate = el._translate,
        moved = el._moved,
        startTime = el._startTime;


    delete el._clientX;
    delete el._clientY;
    delete el._moved;
    delete el._moveStarted;
    delete el._startTime;
    delete el._translate;

    if (!translate) return;

    var endEvent = wrapEvent(e);

    if (moved) {
      var changedX = e.clientX - clientX;
      var changedY = e.clientY - clientY;

      Object.assign(endEvent, {
        changedX: changedX,
        changedY: changedY
      });

      if (handler.moveEnd.call(_this, endEvent) === false) return;

      if (!value.x && !value.y) {
        var absChangedX = Math.abs(changedX);
        var absChangedY = Math.abs(changedY);

        if (absChangedX < 10) {
          if (changedY > 50) {
            if (handler.swipeDown.call(_this, endEvent) === false) return;
          } else if (changedY < -50) {
            if (handler.swipeUp.call(_this, endEvent) === false) return;
          }
        } else if (absChangedY < 10) {
          if (changedX > 50) {
            if (handler.swipeRight.call(_this, endEvent) === false) return;
          } else if (changedX < -50) {
            if (handler.swipeLeft.call(_this, endEvent) === false) return;
          }
        }
      }
    } else {
      var duration = +new Date() - startTime;
      el._tapped = el._tapped + 1 || 1;

      if (duration < 200) {
        return tapTimeoutId = setTimeout(function () {
          var tapped = el._tapped;
          delete el._tapped;
          if (tapped < 3) if (handler[tapped === 1 ? 'tap' : 'dbTap'].call(_this, endEvent) === false) return;
          handler.end.call(_this, endEvent);
        }, 200);
      } else {
        if (handler.press.call(_this, endEvent) === false) return;
      }
    }
    handler.end.call(_this, endEvent);
  });
}

function destroy(el) {
  var $el = touchSupport ? el : document;
  _utils2.default.off(el, EVENTS.start, el.eStart).off($el, EVENTS.move, el.eMove).off($el, EVENTS.end, el.eEnd);
}

exports.default = {
  bind: function bind(el, binding) {
    var _this2 = this;

    init.call(this, el, binding);
    _utils2.default.on(window, 'resize', function () {
      var newTouchSupport = isTouchSupport();
      if (touchSupport === newTouchSupport) return;
      destroy.call(_this2, el, binding);
      touchSupport = newTouchSupport;
      EVENTS = BASE_EVENTS[+touchSupport];
      init.call(_this2, el, binding);
    });
  },

  unbind: destroy
};
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranslate3d = exports.getTranslate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.on = on;
exports.off = off;
exports.translate = translate;

var _base = __webpack_require__(0);

function on(el, events, handler) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  events.trim().split(' ').forEach(function (event) {
    return el.addEventListener(event, handler, useCapture);
  });
  return this;
}

function off(el, events, handler) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  events.trim().split(' ').forEach(function (event) {
    return el.removeEventListener(event, handler, useCapture);
  });
  return this;
}

function translate(el, x, y, z) {
  var args = void 0;
  if (arguments.length === 2 && x !== null && (0, _base.isObject)(x) && (args = x)) {
    x = args.x;
    y = args.y;
    z = args.z;
  }

  var translate = getTranslate3d(el);

  x == null && (x = translate.x);
  y == null && (y = translate.y);
  z == null && (z = translate.z);

  el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)';

  return this;
}

var getTranslate = exports.getTranslate = function getTranslate(el) {
  var matrix = getComputedStyle(el).transform;

  if (!matrix.indexOf('matrix3d')) {
    var _getTranslate3d = getTranslate3d(el),
        x = _getTranslate3d.x,
        y = _getTranslate3d.y;

    return { x: x, y: y };
  } else if (matrix.indexOf('matrix') === -1) return { x: 0, y: 0 };

  var matrixArr = matrix.substring(7, matrix.length - 1).split(',');
  return {
    x: +matrixArr[4],
    y: +matrixArr[5]
  };
};

var getTranslate3d = exports.getTranslate3d = function getTranslate3d(el) {
  var matrix = getComputedStyle(el).transform;

  if (matrix.indexOf('matrix3d') === -1) {
    return _extends({}, getTranslate(el), {
      z: 0
    });
  }

  var matrixArr = matrix.substring(9, matrix.length - 1).split(/, */);
  return {
    x: +matrixArr[12],
    y: +matrixArr[13],
    z: +matrixArr[14]
  };
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./base.js": 0,
	"./dom.js": 3,
	"./index.js": 1
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 4;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _touch = __webpack_require__(2);

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