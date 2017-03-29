/**
 * React compile task for pon
 * @module pon-task-react
 * @version 1.0.0
 */

'use strict'

const create = require('./create')
const Define = require('./define')

let lib = create.bind(this)

Object.assign(lib, Define, {
  create,
  Define
})

module.exports = lib
