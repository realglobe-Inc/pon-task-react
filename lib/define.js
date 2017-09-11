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

const {byPattern} = require('pon-task-compile')
const buildinPlugins = require('./plugins')
const {statAsync} = require('asfs')
const {cachedRequire} = require('pon-cache')

const mtimeOf = (filename) => statAsync(filename).catch(() => null)
  .then((state) => state ? state.mtime : null)

/** @lends define */
function define (srcDir, destDir, options = {}) {
  const {
    pattern = ['**/*.jsx', '**/*.js'],
    minified = false,
    presets = ['react'],
    extractCss,
    watchTargets = [],
    plugins = [buildinPlugins.cssModules({extractCss})],
    sourceMaps = 'inline',
    sourceRoot = srcDir,
    watchDelay = 100
  } = options

  const compiler = async (code, inputSourceMap = null, options = {}) => {
    const {src, dest, watching} = options

    const babel = cachedRequire('babel-core') // Require here to reduce initial loading time
    const compiled = babel.transform(code, {
      minified,
      presets: [
        ['env', {targets: {browsers: ['> 1%']}}]
      ].concat(presets || [])
        .filter((name, i, array) => array.indexOf(name) === i),
      plugins,
      filename: src,
      sourceMaps,
      sourceRoot,
      inputSourceMap
    })
    return [compiled.code, compiled.map]
  }

  const task = byPattern(srcDir, destDir, compiler, {
    pattern,
    watchDelay,
    watchTargets,
    namer: (filename) => filename.replace(/\.jsx$/, '.js')
  })

  const {watch} = task

  return Object.assign(function react (ctx) {
    return task(ctx)
  }, {
    watch: function watchDecorate (ctx) {
      const {logger} = ctx
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
