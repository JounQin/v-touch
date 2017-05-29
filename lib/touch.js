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
  methods: false,
  enable: true
}

const MOUSE_EVENT_PROPS = ['altKey', 'button', 'buttons', 'clientX', 'clientY', 'ctrlKey', 'metaKey',
  'movementX', 'movementY', 'region', 'relatedTarget', 'screenX', 'screenY', 'shiftKey', 'which']

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
  const isPrevent = (event, e) => {
    if (!event) return
    return event.call(this, e) === false || e.returnValue === false
  }

  value = Object.assign({}, DEFAULT_OPTIONS, value)

  if (!value.enable) return

  const {
    start, moveStart, moving, moveEnd, end, tap, dblTap, mltTap,
    press, pressing, swipeLeft, swipeRight, swipeUp, swipeDown
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

  const removeInterval = () => el._interval && (clearInterval(el._interval) || (delete el._interval))

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

    if (!el._moveStarted) return

    removeInterval()

    isPrevent(moving, Object.assign(wrappedEvent, {changedX, changedY}))
  }

  el.eEnd = e => {
    removeInterval()

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

        const link = isSingle && findLinkNode(el, e)

        let _click

        if (link) {
          _click = link._click = true
          link.click()
        }

        const eventInit = {
          bubbles: true,
          cancelable: true,
          cancelBubble: true,
          ...MOUSE_EVENT_PROPS.reduce((event, prop) => {
            event[prop] = e[prop]
            return event
          }, {})
        }

        const prefix = isSingle ? '' : 'dbl'

        const clickEv = new MouseEvent(`${prefix}click`, eventInit)
        isSingle && (clickEv._click = true)

        const {target} = e
        if (target.dispatchEvent(clickEv) === false || clickEv.returnValue === false) return

        const tapEv = new MouseEvent(`${prefix}tap`, eventInit)

        if (e.target.dispatchEvent(tapEv) === false || tapEv.returnValue === false) return
      } else if (isPrevent(mltTap, Object.assign(endEvent, {tapped}))) return
      isPrevent(end, endEvent)
    }, 200)
  }

  el.eStart = e => {
    clearTimeout(el._timeout)
    removeInterval()

    const isMouseDown = e.type === MOUSE_DOWN

    if (isMouseDown) {
      e.target.tagName.toLowerCase() === 'img' && e.preventDefault()
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

    const wrappedEvent = wrapEvent(e)

    isPrevent(start, wrappedEvent) && (el._doNotMove = true)

    el._interval = setInterval(() => el._startTime ? isPrevent(pressing, wrappedEvent) : removeInterval(), 200)
  }

  el.eClick = e => {
    if (e._click) return delete e._click
    e.preventDefault()
    e.stopPropagation()
  }

  on(el, EVENTS.start, el.eStart)
  on(el, EVENTS.move, el.eMove)
  on(el, EVENTS.end, el.eEnd)
  on(el, 'click', el.eClick)
}

function destroy(el) {
  off(el, EVENTS.start, el.eStart)
  off(el, EVENTS.move, el.eMove)
  off(el, EVENTS.end, el.eEnd)
  off(el, 'click', el.eClick)
}

export default {
  bind(el, binding, vnode) {
    const {context} = vnode
    init.call(context, el, binding)
  },
  unbind: destroy
}
