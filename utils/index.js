export default {
  on(el, event, handler) {
    el.addEventListener(event, handler, false)
    return this
  },
  off(el, event, handler) {
    el.removeEventListener(event, handler, false)
    return this
  }
}
