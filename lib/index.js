/**
 * React compile task for pon
 * @module pon-task-react
 * @version 4.2.2
 */

'use strict'

const define = require('./define')

const lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
