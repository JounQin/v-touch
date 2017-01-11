['on', 'off'].forEach((val, index) => {
  module.exports[val] = (el, events, handler) => events.trim().split(' ').forEach(event => event && el[`${index ? 'remove' : 'add'}EventListener`](event, handler, false))
})
