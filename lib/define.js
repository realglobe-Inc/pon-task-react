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
const ababelReact = require('ababel-react')

/** @lends define */
function define (srcDir, destDir, options = {}) {
  let { pattern = '**/*.js' } = options

  function task (ctx) {
    return co(function * () {
      yield ababelReact(pattern, {
        cwd: srcDir,
        out: destDir,
        pattern
      })
    })
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define
