/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['env', 'react']] - Babel preset names
 * @param {string[]} [options.plugins=[]] - Babel plugin names
 * @param {string[]} [options.watchTargets=[]] - Additional watch target filenames
 * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
'use strict'

const path = require('path')
const {byPattern} = require('pon-task-compile')
const {statAsync, readFileAsync} = require('asfs')
const {cachedRequire} = require('pon-cache')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  const {
    pattern = ['**/*.jsx', '**/*.js', '**/*.mjs'],
    minified = false,
    presets = [
      ['react'],
      ['env', {targets: {browsers: ['> 1%']}}]
    ],
    watchTargets = [],
    plugins = [],
    sourceMaps = 'inline',
    sourceRoot = srcDir,
    watchDelay = 100,
    ext = '.js'
  } = options

  const compiler = async (code, inputSourceMap = null, options = {}) => {
    const {src, dest, watching} = options

    const srcStat = await statAsync(src).catch(() => null)
    const destStat = await statAsync(dest).catch(() => null)
    const notChanged = srcStat && destStat && (srcStat.mtime < destStat.mtime)
    if (notChanged) {
      return []
    }
    const isJson = path.extname(src) === '.json'
    if (isJson) {
      return [await readFileAsync(src)]
    }
    const babel = cachedRequire('babel-core') // Require here to reduce initial loading time
    const compiled = babel.transform(code, {
      minified,
      presets: [].concat(presets || []),
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
    namer: (filename) => filename.replace(/\.mjs$/, ext).replace(/\.jsx$/, ext)
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
