import touch from './touch'

let installed = false

export default {
  install(Vue, options = {}) {
    if (installed) return
    installed = true
    Vue.directive(options.name || 'touch', touch)
  }
}
