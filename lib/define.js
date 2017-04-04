/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['es2015', 'react']] - Babel preset names
 * * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
'use strict'

const co = require('co')
const path = require('path')
const aglob = require('aglob')
const babel = require('babel-core')
const compile = require('pon-task-compile')
const watch = require('pon-task-watch')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  let {
    pattern = [ '**/*.jsx', '**/*.js' ],
    presets = [ 'es2015', 'react' ],
    sourceMaps = 'inline',
    watchDelay = 100
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
    {
      watch: (ctx) => co(function * () {
        return watch(
          [].concat(pattern).map((pattern) => path.join(srcDir, pattern)),
          (event, changed) => {
            let filename = path.relative(srcDir, changed)
            const { src, dest } = resolvePaths(filename)
            compile(src, dest, compiler)(ctx)
          },
          {
            delay: watchDelay
          }
        )(ctx)
      })
    }
  )
}

module.exports = define
