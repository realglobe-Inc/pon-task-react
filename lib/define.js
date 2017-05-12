/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['es2015', 'es2016', 'es2017', 'react']] - Babel preset names
 * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
'use strict'

const { byPattern } = require('pon-task-compile')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  let {
    pattern = [ '**/*.jsx', '**/*.js' ],
    presets = [ 'es2015', 'es2016', 'es2017', 'react' ],
    sourceMaps = 'inline',
    sourceRoot = srcDir,
    watchDelay = 100
  } = options

  const compiler = (code, inputSourceMap = null, options = {}) => {
    let { src } = options
    const babel = require('babel-core') // Require here to reduce initial loading time
    let compiled = babel.transform(code, {
      presets,
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
    namer: (filename) => filename.replace(/\.jsx$/, '.js')
  })

  let { watch } = task

  return Object.assign(function react (ctx) {
    return task(ctx)
  }, { watch })
}

module.exports = define
