export default {
  on(el, events, handler, useCapture = false) {
    events.trim().split(' ').forEach(event => el.addEventListener(event, handler, useCapture))
    return this
  },
  off(el, events, handler, useCapture = false) {
    events.trim().split(' ').forEach(event => el.removeEventListener(event, handler, useCapture))
    return this
  }
}
