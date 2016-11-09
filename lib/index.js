import touch from './touch'

let installed = false

const VTouch = {
  install(Vue, options = {}) {
    if (installed) return
    installed = true
    Vue.directive(options.name || 'touch', touch)
  }
}

window.Vue && window.Vue.use(VTouch)

export default VTouch
