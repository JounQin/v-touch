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

const DEFAULT_OPTIONS = {
  x: false,
  y: false,
  speed: 1,
  context: undefined,
  methods: false
}

const actualEvent = (e, prevent, stop) => {
  prevent && e.preventDefault && e.preventDefault()
  stop && e.stopPropagation && e.stopPropagation()
  return touchSupport ? e.changedTouches[0] : e
}

let tapTimeoutId
const isPreventFunc = context => (event, ...params) => !!(event && event.apply(context, params) === false)

function init(el, {value, modifiers: {prevent, stop}}) {
  value = Object.assign({}, DEFAULT_OPTIONS, value)

  const {context, methods} = value
  const isPrevent = isPreventFunc(context)
  const {
    start, moveStart, moving, moveEnd, end, tap, dbTap,
    press, swipeLeft, swipeRight, swipeUp, swipeDown
  } = context && methods ? context : value
  const $el = touchSupport ? el : document
  const eventParam = Object.create({}, {currentTarget: {value: el, writable: false}})
  const wrapEvent = (e, params) => Object.assign(e, eventParam, params)

  utils.on(el, EVENTS.start, el.eStart = e => {
    clearTimeout(tapTimeoutId)
    // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
    e = actualEvent(e, true, stop)
    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _translate: getTranslate(el),
      _startTime: +new Date()
    })
    isPrevent(start, wrapEvent(e)) && (el._doNotMove = true)
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

    const wrappedEvent = wrapEvent(e)

    if (el._moved && !el._moveStarted) {
      if (isPrevent(moveStart, wrappedEvent)) return
      el._moveStarted = true
    }

    let translateX = value.x ? originalTranslateX + value.speed * changedX : originalTranslateX
    let translateY = value.y ? originalTranslateY + value.speed * changedY : originalTranslateY

    const movingEvent = Object.assign(wrappedEvent, {
      translateX,
      translateY,
      changedX,
      changedY
    })

    if (isPrevent(moving, movingEvent)) return

    translateX = movingEvent.translateX
    translateY = movingEvent.translateY

    translate(el, translateX, translateY)
  }).on($el, EVENTS.end, el.eEnd = e => {
    e = actualEvent(e, prevent, stop)

    const {_clientX: clientX, _clientY: clientY, _translate: translate, _moved: moved, _startTime: startTime} = el

    delete el._clientX
    delete el._clientY
    delete el._doNotMove
    delete el._moved
    delete el._moveStarted
    delete el._startTime
    delete el._translate

    if (!translate) return

    const endEvent = wrapEvent(e)

    if (moved) {
      const changedX = e.clientX - clientX
      const changedY = e.clientY - clientY

      Object.assign(endEvent, {changedX, changedY})

      if (isPrevent(moveEnd, endEvent)) return

      if (!value.x && !value.y) {
        const absChangedX = Math.abs(changedX)
        const absChangedY = Math.abs(changedY)

        let event
        if (absChangedX < 20) {
          if (changedY > 50) {
            event = swipeDown
          } else if (changedY < -50) {
            event = swipeUp
          }
        } else if (absChangedY < 20) {
          if (changedX > 50) {
            event = swipeRight
          } else if (changedX < -50) {
            event = swipeLeft
          }
        }
        if (isPrevent(event, endEvent)) return
      }
    } else {
      const duration = +new Date() - startTime
      el._tapped = el._tapped + 1 || 1

      if (duration < 200) {
        // eslint-disable-next-line no-return-assign
        return tapTimeoutId = setTimeout(() => {
          const tapped = el._tapped
          delete el._tapped
          if (tapped < 3) {
            const tapEvent = tapped === 1 ? tap : dbTap
            if (isPrevent(tapEvent, endEvent)) return
          }
          isPrevent(end, endEvent)
        }, 200)
      } else if (isPrevent(press, endEvent)) return
    }

    isPrevent(end, endEvent)
  })
}

function destroy(el, binding) {
  const $el = touchSupport ? el : document
  utils.off(el, EVENTS.start, el.eStart)
    .off($el, EVENTS.move, el.eMove)
    .off($el, EVENTS.end, el.eEnd)

  binding === true || utils.off(window, 'resize', el.eResize)
}

export default {
  bind(el, binding) {
    init.call(this, el, binding)
    utils.on(window, 'resize', el.eResize = () => {
      const newTouchSupport = isTouchSupport()
      if (touchSupport === newTouchSupport) return
      destroy.call(this, el, true)
      touchSupport = newTouchSupport
      EVENTS = BASE_EVENTS[+touchSupport]
      init.call(this, el, binding)
    })
  },
  update(el, binding) {
    destroy.call(this, el, true)
    init.call(this, el, binding)
  },
  unbind: destroy
}
