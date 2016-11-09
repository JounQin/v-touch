import utils, {getTranslate, translate} from '../utils'

const touchSupport = !!(('ontouchstart' in window &&
navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
(window.DocumentTouch && document instanceof window.DocumentTouch) ||
(window.navigator['msPointerEnabled'] &&
window.navigator['msMaxTouchPoints'] > 0) || // IE 10
(window.navigator['pointerEnabled'] &&
window.navigator['maxTouchPoints'] > 0) || // IE >=11
false)

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

export default {
  bind(el, {value, modifiers:{prevent, stop}}) {
    value = Object.assign({}, DEFAULT_OPTIONS, value)
    const handler = Object.assign({}, HANDLER, value.handler)
    const $el = touchSupport ? el : document
    const eventParam = Object.create({}, {currentTarget: {value: el, writable: false}})
    const wrapEvent = (e, params) => Object.assign(e, eventParam, params)
    utils.on(el, EVENTS.start, el.eStart = e => {
      clearTimeout(tapTimeoutId)
      // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
      e = actualEvent(e, true, stop)
      if (false === handler.start.call(this, wrapEvent(e))) el._doNotMove = true
      Object.assign(el, {
        _clientX: e.clientX,
        _clientY: e.clientY,
        _translate: getTranslate(el),
        _startTime: +new Date
      })
    }).on($el, EVENTS.move, el.eMove = e => {
      const originalTranslate = el._translate
      if (!originalTranslate || el._doNotMove) return
      e = actualEvent(e, prevent, stop)

      const {clientX, clientY} = e
      const {_clientX:originalClientX, _clientY:originalClientY} = el
      const {x:originalTranslateX, y:originalTranslateY} = originalTranslate

      const changedX = clientX - originalClientX
      const changedY = clientY - originalClientY

      if (Math.abs(changedX) > 5 || Math.abs(changedY) > 5) el._moved = true

      if (el._moved && !el._moveStarted) {
        if (false === handler.moveStart.call(this, wrapEvent(e))) return
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

      if (false === handler.moving.call(this, movingEvent)) return
      translateX = movingEvent.translateX
      translateY = movingEvent.translateY

      translate(el, translateX, translateY)
    }).on($el, EVENTS.end, el.eEnd = e => {
      e = actualEvent(e, prevent, stop)

      delete el._moveStarted

      if (!el._translate) return

      const endEvent = wrapEvent(e)

      if (el._moved) {
        const changedX = e.clientX - el._clientX
        const changedY = e.clientY - el._clientY

        const moveEndEvent = Object.assign(endEvent, {
          changedX,
          changedY
        })

        if (false === handler.moveEnd.call(this, moveEndEvent)) return

        if (!value.x && !value.y) {
          const absChangedX = Math.abs(changedX)
          const absChangedY = Math.abs(changedY)

          if (absChangedX < 10) {
            if (changedY > 50) {
              if (false === handler.swipeDown.call(this, moveEndEvent)) return
            } else if (changedY < -50) {
              if (false === handler.swipeUp.call(this, moveEndEvent)) return
            }
          } else if (absChangedY < 10) {
            if (changedX > 50) {
              if (false === handler.swipeRight.call(this, moveEndEvent)) return
            } else if (changedX < -50) {
              if (false === handler.swipeLeft.call(this, moveEndEvent)) return
            }
          }
        }
      } else {
        const duration = +new Date - el._startTime
        el._tapped = el._tapped + 1 || 1

        if (duration < 200) {
          return tapTimeoutId = setTimeout(() => {
            const tapped = el._tapped
            delete el._tapped
            if (tapped < 3) if (false === handler[tapped === 1 ? 'tap' : 'dbTap'].call(this, endEvent)) return
            handler.end.call(this, endEvent)
          }, 200)
        } else {
          if (false === handler.press.call(this, endEvent)) return
        }
      }

      handler.end.call(this, endEvent)
    })
  },
  unbind(el) {
    const $el = touchSupport ? el : document
    utils.off(el, EVENTS.start, el.eStart)
      .off($el, EVENTS.move, el.eMove)
      .off($el, EVENTS.end, el.eEnd)
  }
}
