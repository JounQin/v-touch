export const on = (el, event, handler) => el.addEventListener(event, handler, false)
export const off = (el, event, handler) => el.removeEventListener(event, handler, false)
