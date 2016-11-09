import {isObject} from './base'

export function on(el, events, handler, useCapture = false) {
  events.trim().split(' ').forEach(event => el.addEventListener(event, handler, useCapture))
  return this
}

export function off(el, events, handler, useCapture = false) {
  events.trim().split(' ').forEach(event => el.removeEventListener(event, handler, useCapture))
  return this
}

export function translate(el, x, y, z) {
  let args
  if (arguments.length === 2 && x !== null && isObject(x) && (args = x)) {
    x = args.x
    y = args.y
    z = args.z
  }

  const translate = getTranslate3d(el)

  x == null && (x = translate.x)
  y == null && (y = translate.y)
  z == null && (z = translate.z)

  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`

  return this
}

export const getTranslate = el => {
  const matrix = getComputedStyle(el).transform

  if (!matrix.indexOf('matrix3d')) {
    const {x, y} = getTranslate3d(el)
    return {x, y}
  } else if (matrix.indexOf('matrix') === -1) return {x: 0, y: 0}

  const matrixArr = matrix.substring(7, matrix.length - 1).split(',')
  return {
    x: +matrixArr[4],
    y: +matrixArr[5]
  }
}

export const getTranslate3d = el => {
  const matrix = getComputedStyle(el).transform

  if (matrix.indexOf('matrix3d') === -1) {
    return {
      ...getTranslate(el),
      z: 0
    } }

  const matrixArr = matrix.substring(9, matrix.length - 1).split(/, */)
  return {
    x: +matrixArr[12],
    y: +matrixArr[13],
    z: +matrixArr[14]
  }
}
