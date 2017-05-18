'use strict'

exports.cssModules = (options = {}) => {
  let {
    extensions = [ '.css', '.scss', '.less', '.pcss' ],
    extractCss
  } = options
  return [
    'css-modules-transform', Object.assign({}, {
      extensions,
      extractCss
    }, options)
  ]
}

