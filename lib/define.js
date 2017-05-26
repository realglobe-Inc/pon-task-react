/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['es2015', 'es2016', 'es2017', 'react']] - Babel preset names
 * @param {string} [options.extractCss] - Path to extract css
 * @param {string[]} [options.plugins=['css-modules-transform']] - Babel plugin names
 * @param {string[]} [options.watchTargets=[]] - Additional watch target filenames
 * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
'use strict'

const { byPattern } = require('pon-task-compile')
const buildinPlugins = require('./plugins')
const { cachedRequire } = require('pon-cache')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  let {
    pattern = [ '**/*.jsx', '**/*.js' ],
    presets = [ 'es2015', 'es2016', 'es2017', 'react' ],
    extractCss,
    watchTargets = [],
    plugins = [ buildinPlugins.cssModules({ extractCss }) ],
    sourceMaps = 'inline',
    sourceRoot = srcDir,
    watchDelay = 100
  } = options

  const compiler = (code, inputSourceMap = null, options = {}) => {
    let { src } = options
    const babel = cachedRequire('babel-core') // Require here to reduce initial loading time
    let compiled = babel.transform(code, {
      presets,
      plugins,
      filename: src,
      sourceMaps,
      sourceRoot,
      inputSourceMap
    })
    return [ compiled.code, compiled.map ]
  }

  let task = byPattern(srcDir, destDir, compiler, {
    pattern,
    watchDelay,
    watchTargets,
    namer: (filename) => filename.replace(/\.jsx$/, '.js')
  })

  let { watch } = task

  return Object.assign(function react (ctx) {
    return task(ctx)
  }, {
    watch: function watchDecorate (ctx) {
      const { logger } = ctx
      // Env check
      {
        const wanted = 'development'
        const actual = process.env.NODE_ENV
        if (wanted !== actual) {
          logger.warn(`NODE_ENV should be "${wanted}", but given: "${actual}"`)
        }
      }
      return watch.apply(this, arguments)
    }
  })
}

module.exports = define
