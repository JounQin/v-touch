import utils from '../utils'

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
  methods: false
}

const actualEvent = (e, prevent, stop) => {
  prevent && e.preventDefault && e.preventDefault()
  stop && e.stopPropagation && e.stopPropagation()
  return touchSupport ? e.changedTouches[0] : e
}

let tapTimeoutId
const isPreventFunc = context => (event, ...params) => event && event.apply(context, params) === false

function init(el, {value, modifiers: {prevent, stop}}) {
  const isPrevent = isPreventFunc(this)
  value = Object.assign({}, DEFAULT_OPTIONS, value)
  const {
    start, moveStart, moving, moveEnd, end, tap, dblTap, mltTap,
    press, swipeLeft, swipeRight, swipeUp, swipeDown
  } = value.methods ? this : value
  const $el = touchSupport ? el : document
  const wrapEvent = e => Object.defineProperties(e, {
    currentTarget: {
      value: el,
      readable: true,
      writable: true,
      enumerable: true,
      configurable: true
    }
  })

  utils.on(el, EVENTS.start, el.eStart = e => {
    clearTimeout(tapTimeoutId)
    // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
    e = actualEvent(e, true, stop)
    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _startTime: +new Date()
    })
    isPrevent(start, wrapEvent(e)) && (el._doNotMove = true)
  }).on($el, EVENTS.move, el.eMove = e => {
    if (el._doNotMove) return
    e = actualEvent(e, prevent, stop)

    const {clientX, clientY} = e
    const {_clientX: originalClientX, _clientY: originalClientY} = el

    const changedX = clientX - originalClientX
    const changedY = clientY - originalClientY

    if (Math.abs(changedX) > 5 || Math.abs(changedY) > 5) el._moved = true

    const wrappedEvent = wrapEvent(e)

    if (el._moved && !el._moveStarted) {
      if (isPrevent(moveStart, wrappedEvent)) return
      el._moveStarted = true
    }

    el._moveStarted && isPrevent(moving, Object.assign(wrappedEvent, {
      changedX,
      changedY
    }))
  }).on($el, EVENTS.end, el.eEnd = e => {
    e = actualEvent(e, prevent, stop)

    const {_clientX: clientX, _clientY: clientY, _moved: moved, _startTime: startTime} = el

    delete el._clientX
    delete el._clientY
    delete el._doNotMove
    delete el._moved
    delete el._moveStarted
    delete el._startTime

    const endEvent = wrapEvent(e)

    if (moved) {
      const changedX = e.clientX - clientX
      const changedY = e.clientY - clientY

      Object.assign(endEvent, {changedX, changedY})

      if (isPrevent(moveEnd, endEvent)) return

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

      return isPrevent(end, endEvent)
    }

    const duration = +new Date() - startTime
    el._tapped = el._tapped + 1 || 1

    if (duration > 200) return isPrevent(press, endEvent) && isPrevent(end, endEvent)

    tapTimeoutId = setTimeout(() => {
      const tapped = el._tapped
      delete el._tapped
      if (tapped < 3) {
        const isSingle = tapped === 1
        const tapEvent = isSingle ? tap : dblTap
        if (isPrevent(tapEvent, endEvent)) return
        const eventInit = {
          bubbles: true,
          cancelable: true,
          cancelBubble: true
        }
        const prefix = isSingle ? '' : 'dbl'
        if (touchSupport && e.target.dispatchEvent(new Event(`${prefix}click`, eventInit)) === false) return
        if (e.target.dispatchEvent(new Event(`${prefix}tap`, eventInit)) === false) return
      } else if (isPrevent(mltTap, Object.assign(endEvent, {tapped}))) return
      isPrevent(end, endEvent)
    }, 200)
  })
}

function destroy(el, binding) {
  const $el = touchSupport ? el : document
  utils.off(el, EVENTS.start, el.eStart)
    .off($el, EVENTS.move, el.eMove)
    .off($el, EVENTS.end, el.eEnd)
  binding === true || utils.off(window, 'resize', el.eResize)
}

let resizeTimeoutId

export default {
  bind(el, binding, vnode) {
    const {context} = vnode
    init.call(context, el, binding)

    utils.on(window, 'resize', el.eResize = () => {
      clearTimeout(resizeTimeoutId)

      resizeTimeoutId = setTimeout(() => {
        const newTouchSupport = isTouchSupport()
        if (touchSupport === newTouchSupport) return
        destroy.call(context, el, true)
        touchSupport = newTouchSupport
        EVENTS = BASE_EVENTS[+touchSupport]
        init.call(context, el, binding)
      }, 300)
    })
  },
  unbind: destroy
}
