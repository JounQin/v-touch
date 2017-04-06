const webpack = require('webpack')
const path = require('path')
const pkg = require('../package.json')

const isProduction = process.env.NODE_ENV === 'production'

const plugins = [new webpack.BannerPlugin({
  banner: `${pkg.name} -- ${pkg.description}
Version ${pkg.version}\n
Copyright (C) 2016-2017 ${pkg.author}
Released under the ${pkg.license} license\n
Github: ${pkg.repository.url}`,
  entryOnly: true
})]

isProduction && plugins.push(new webpack.optimize.UglifyJsPlugin())

module.exports = {
  target: 'web',
  entry: {
    'v-touch': './lib/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `[name]${isProduction ? '.min' : ''}.js`,
    libraryTarget: 'umd',
    library: 'VTouch'
  },
  plugins
}
