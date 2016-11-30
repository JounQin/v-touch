import {isObject} from './base'

export function on(el, events, handler, useCapture = false) {
  events.trim().split(' ').forEach(event => el.addEventListener(event, handler, useCapture))
  return this
}

export function off(el, events, handler, useCapture = false) {
  events.trim().split(' ').forEach(event => el.removeEventListener(event, handler, useCapture))
  return this
}
