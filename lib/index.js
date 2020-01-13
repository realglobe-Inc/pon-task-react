/**
 * React compile task for pon
 * @module pon-task-react
 * @version 5.2.0
 */

'use strict'

const define = require('./define')

const lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
