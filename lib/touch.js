import utils from './utils'

const touchSupport = !!(('ontouchstart' in window &&
navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
(window.DocumentTouch && document instanceof window.DocumentTouch) ||
(window.navigator['msPointerEnabled'] &&
window.navigator['msMaxTouchPoints'] > 0) || // IE 10
(window.navigator['pointerEnabled'] &&
window.navigator['maxTouchPoints'] > 0) || // IE >=11
false)

const actualEvent = e => touchSupport ? e.changedTouches[0] : e

const EVENTS = [{
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}][+touchSupport]

const EMPTY_FUNC = () => {}
const HANDLER = {};

['start', 'moveStart', 'moving', 'moveEnd', 'end',
  'tap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown']
  .forEach(event => HANDLER[event] = EMPTY_FUNC) // eslint-disable-line no-return-assign

const DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1
}

export default {
  bind(el, binding) {
    const value = binding.value
    Object.assign({}, DEFAULT_OPTIONS, value)
    const handler = Object.assign({}, HANDLER, value.handler)
    const $el = touchSupport ? el : document
    utils.on($el, EVENTS.start, e => {
      // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
      e.preventDefault()
      handler.start.call(this, actualEvent(e))
    }).on($el, EVENTS.move, e => {
      e = actualEvent(e)
      handler.moveStart.call(this, e)
      handler.moving.call(this, e)
      handler.moveEnd.call(this, e)
    }).on($el, EVENTS.end, e => {
      e = actualEvent(e)
      handler.end.call(this, e)
    })
  }
}
