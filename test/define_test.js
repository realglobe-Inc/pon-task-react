/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const colorprint = require('colorprint')
const { ok } = require('assert')
const co = require('co')

describe('define', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let ctx = {
      logger: colorprint.create()
    }
    let task = define(
      `${__dirname}/../misc/mocks`,
      `${__dirname}/../tmp/testing`,
      { pattern: [ '**/*.js', '**/*.jsx' ] }
    )
    ok(task)

    yield Promise.resolve(task(ctx))

    ok(require('../tmp/testing/mock-react'))
  }))
})

/* global describe, before, after, it */