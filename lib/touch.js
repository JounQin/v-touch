import {on, off} from './utils'

const MOUSE_DOWN = 'mousedown'
const MOUSE_MOVE = 'mousemove'
const MOUSE_UP = 'mouseup'

const EVENTS = {
  start: `touchstart ${MOUSE_DOWN}`,
  move: 'touchmove',
  end: 'touchend touchcancel'
}

const DEFAULT_OPTIONS = {
  methods: false
}

const actualEvent = (e, prevent, stop) => {
  prevent && e.preventDefault && e.preventDefault()
  stop && e.stopPropagation && e.stopPropagation()
  const touches = e.changedTouches
  return {
    event: touches ? touches[0] : e,
    support: !!touches
  }
}

function init(el, {value, modifiers: {prevent, stop}}) {
  const isPrevent = (event, ...params) => event && event.apply(this, params) === false

  value = Object.assign({}, DEFAULT_OPTIONS, value)

  const {
    start, moveStart, moving, moveEnd, end, tap, dblTap, mltTap,
    press, swipeLeft, swipeRight, swipeUp, swipeDown
  } = value.methods ? this : value

  const wrapEvent = e => Object.defineProperties(e, {
    currentTarget: {
      value: el,
      readable: true,
      writable: true,
      enumerable: true,
      configurable: true
    }
  })

  el.eMove = e => {
    if (!el._startTime || el._doNotMove) return

    e = actualEvent(e, prevent, stop).event

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
  }

  el.eEnd = e => {
    if (e.type === MOUSE_UP) {
      off(document, MOUSE_MOVE, el.eMove)
      off(document, MOUSE_UP, el.eEnd)
    }

    if (!el._startTime) return

    const actual = actualEvent(e, prevent, stop)
    e = actual.event

    const {_clientX, _clientY, _moved, _startTime} = el

    delete el._clientX
    delete el._clientY
    delete el._doNotMove
    delete el._moved
    delete el._moveStarted
    delete el._startTime

    const endEvent = wrapEvent(e)

    if (_moved) {
      const changedX = e.clientX - _clientX
      const changedY = e.clientY - _clientY

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

    const duration = +new Date() - _startTime

    el._tapped = el._tapped + 1 || 1

    if (duration > 200) return isPrevent(press, endEvent) && isPrevent(end, endEvent)

    el._timeout = setTimeout(() => {
      const tapped = el._tapped

      delete el._tapped
      delete el._timeout

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

        if (actual.support && e.target.dispatchEvent(new Event(`${prefix}click`, eventInit)) === false) return

        if (e.target.dispatchEvent(new Event(`${prefix}tap`, eventInit)) === false) return
      } else if (isPrevent(mltTap, Object.assign(endEvent, {tapped}))) return
      isPrevent(end, endEvent)
    }, 200)
  }

  on(el, EVENTS.start, el.eStart = e => {
    clearTimeout(el._timeout)

    const isMouseDown = e.type === MOUSE_DOWN

    if (isMouseDown) {
      on(document, MOUSE_MOVE, el.eMove)
      on(document, MOUSE_UP, el.eEnd)
    }

    // fix Android does't not emit touchmove event when touchstart doesn't preventDefault
    e = actualEvent(e, isMouseDown ? prevent : true, stop).event

    Object.assign(el, {
      _clientX: e.clientX,
      _clientY: e.clientY,
      _startTime: +new Date()
    })

    isPrevent(start, wrapEvent(e)) && (el._doNotMove = true)
  })

  on(el, EVENTS.move, el.eMove)
  on(el, EVENTS.end, el.eEnd)
}

function destroy(el) {
  off(el, EVENTS.start, el.eStart)
  off(el, EVENTS.move, el.eMove)
  off(el, EVENTS.end, el.eEnd)
}

export default {
  bind(el, binding, vnode) {
    const {context} = vnode
    init.call(context, el, binding)
  },
  unbind: destroy
}
