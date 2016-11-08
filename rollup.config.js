const pkg = require('./package.json')

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const plugins = [babel()]
const isProduction = process.env.NODE_ENV === 'production'

isProduction && plugins.push(uglify({
  output: {
    comments: true
  }
}))

export default {
  entry: 'lib/index.js',
  moduleName: 'VTouch',
  moduleId: pkg.name,
  plugins,
  format: 'umd',
  banner: `/*!  @license
  *  ${pkg.name} -- ${pkg.description}
  *  GitHub: ${pkg.repository.url}
  */`,
  dest: `dist/v-touch${isProduction ? '.min' : ''}.js`
}
