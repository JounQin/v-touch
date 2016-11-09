import utils, {getTranslate, translate} from '../utils'

const isTouchSupport = () => {
  return !!(('ontouchstart' in window &&
  navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
  (window.DocumentTouch && document instanceof window.DocumentTouch) ||
  (window.navigator['msPointerEnabled'] &&
  window.navigator['msMaxTouchPoints'] > 0) || // IE 10
  (window.navigator['pointerEnabled'] &&
  window.navigator['maxTouchPoints'] > 0) || // IE >=11
  false)
}

let touchSupport = isTouchSupport()

const BASE_EVENTS = [{
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup'
}, {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend'
}]

let EVENTS = BASE_EVENTS[+touchSupport]

const EMPTY_FUNC = () => {}
const HANDLER = {};

['start', 'moveStart', 'moving', 'moveEnd', 'end',
  'tap', 'dbTap', 'press', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown']
  .forEach(event => HANDLER[event] = EMPTY_FUNC) // eslint-disable-line no-return-assign

const DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1
}

const actualEvent = (e, prevent, stop) => {
  prevent && e.preventDefault && e.preventDefault()
  stop && e.stopPropagation && e.stopPropagation()
  return touchSupport ? e.changedTouches[0] : e
}

let tapTimeoutId

function init(el, {value, modifiers: {prevent, stop}}) {
  value = Object.assign({}, DEFAULT_OPTIONS, value)
  const handler = Object.assign({}, HANDLER, value.handler)
  const $el = touchSupport ? el : document
  const eventParam = Object.create({}, {currentTarget: {value: el, writable: false}})
  const wrapEvent = (e, params) => Object.assign(e, eventParam, params)
  utils.on(el, EVENTS.start, el.eStart = e => {
    clearTimeout(tapTimeoutId)
    // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
    e = actualEvent(e, true, stop)
    if (handler.start.call(this, wrapEvent(e)) === false) el._doNotMove = true
    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _translate: getTranslate(el),
      _startTime: +new Date()
    })
  }).on($el, EVENTS.move, el.eMove = e => {
    const originalTranslate = el._translate
    if (!originalTranslate || el._doNotMove) return
    e = actualEvent(e, prevent, stop)

    const {clientX, clientY} = e
    const {_clientX: originalClientX, _clientY: originalClientY} = el
    const {x: originalTranslateX, y: originalTranslateY} = originalTranslate

    const changedX = clientX - originalClientX
    const changedY = clientY - originalClientY

    if (Math.abs(changedX) > 5 || Math.abs(changedY) > 5) el._moved = true

    if (el._moved && !el._moveStarted) {
      if (handler.moveStart.call(this, wrapEvent(e)) === false) return
      el._moveStarted = true
    }

    let translateX = value.x ? originalTranslateX + value.speed * changedX : originalTranslateX
    let translateY = value.y ? originalTranslateY + value.speed * changedY : originalTranslateY

    const movingEvent = wrapEvent(e, {
      translateX,
      translateY,
      changedX,
      changedY
    })

    if (handler.moving.call(this, movingEvent) === false) return
    translateX = movingEvent.translateX
    translateY = movingEvent.translateY

    translate(el, translateX, translateY)
  }).on($el, EVENTS.end, el.eEnd = e => {
    e = actualEvent(e, prevent, stop)

    const {_clientX: clientX, _clientY: clientY, _translate: translate, _moved: moved, _startTime: startTime} = el

    delete el._clientX
    delete el._clientY
    delete el._moved
    delete el._moveStarted
    delete el._startTime
    delete el._translate

    if (!translate) return

    const endEvent = wrapEvent(e)

    if (moved) {
      const changedX = e.clientX - clientX
      const changedY = e.clientY - clientY

      Object.assign(endEvent, {
        changedX,
        changedY
      })

      if (handler.moveEnd.call(this, endEvent) === false) return

      if (!value.x && !value.y) {
        const absChangedX = Math.abs(changedX)
        const absChangedY = Math.abs(changedY)

        /* eslint-disable max-depth */
        if (absChangedX < 10) {
          if (changedY > 50) {
            if (handler.swipeDown.call(this, endEvent) === false) return
          } else if (changedY < -50) {
            if (handler.swipeUp.call(this, endEvent) === false) return
          }
        } else if (absChangedY < 10) {
          if (changedX > 50) {
            if (handler.swipeRight.call(this, endEvent) === false) return
          } else if (changedX < -50) {
            if (handler.swipeLeft.call(this, endEvent) === false) return
          }
        }
        /* eslint-enable max-depth */
      }
    } else {
      const duration = +new Date() - startTime
      el._tapped = el._tapped + 1 || 1

      if (duration < 200) {
        // eslint-disable-next-line no-return-assign
        return tapTimeoutId = setTimeout(() => {
          const tapped = el._tapped
          delete el._tapped
          if (tapped < 3) if (handler[tapped === 1 ? 'tap' : 'dbTap'].call(this, endEvent) === false) return
          handler.end.call(this, endEvent)
        }, 200)
      } else {
        if (handler.press.call(this, endEvent) === false) return
      }
    }
    handler.end.call(this, endEvent)
  })
}

function destroy(el) {
  const $el = touchSupport ? el : document
  utils.off(el, EVENTS.start, el.eStart)
    .off($el, EVENTS.move, el.eMove)
    .off($el, EVENTS.end, el.eEnd)
}

export default {
  bind(el, binding) {
    init.call(this, el, binding)
    utils.on(window, 'resize', () => {
      const newTouchSupport = isTouchSupport()
      if (touchSupport === newTouchSupport) return
      destroy.call(this, el, binding)
      touchSupport = newTouchSupport
      EVENTS = BASE_EVENTS[+touchSupport]
      init.call(this, el, binding)
    })
  },
  unbind: destroy
}
