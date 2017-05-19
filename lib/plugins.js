'use strict'

exports.cssModules = (options = {}) => {
  let {
    extensions = [ '.css', '.scss', '.less', '.pcss' ],
    extractCss,
    processCss = require.resolve('./helpers/processCss'),
    generateScopedName = require.resolve('./helpers/generateScopedName')
  } = options
  return [
    'css-modules-transform', Object.assign({}, {
      extensions,
      extractCss,
      processCss,
      generateScopedName
    }, options)
  ]
}
