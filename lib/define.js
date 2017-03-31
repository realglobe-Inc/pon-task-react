/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=[]] - Babel preset names
 * @returns {function} Defined task
 */
'use strict'

const co = require('co')
const path = require('path')
const aglob = require('aglob')
const babel = require('babel-core')
const compile = require('pon-task-compile')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  let {
    pattern = '**/*.js',
    presets = [ 'es2015', 'react' ],
    sourceMaps = 'inline'
  } = options

  const resolvePaths = (filename) => ({
    src: path.resolve(srcDir, filename),
    dest: path.resolve(destDir, filename.replace(/\.jsx$/, '.js'))
  })

  const compiler = (code, inputSourceMap = null) => {
    let compiled = babel.transform(code, {
      presets,
      sourceMaps,
      inputSourceMap
    })
    return [ compiled.code, compiled.map ]
  }

  function task (ctx) {
    return co(function * () {
      let filenames = yield aglob(pattern, { cwd: srcDir })
      let results = []
      for (let filename of filenames) {
        const { src, dest } = resolvePaths(filename)
        let result = yield compile(src, dest, compiler)(ctx)
        results.push(result)
      }
      return results
    })
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define
