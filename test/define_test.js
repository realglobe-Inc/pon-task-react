/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const { ok } = require('assert')
const ponContext = require('pon-context')
const asleep = require('asleep')
const writeout = require('writeout')

const co = require('co')

describe('define', function () {
  this.timeout(5000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let ctx = ponContext()
    let task = define(
      `${__dirname}/../misc/mocks`,
      `${__dirname}/../tmp/testing`,
      {
        pattern: [ '**/*.js', '**/*.jsx' ],
        extractCss: `${__dirname}/../tmp/testing/bundle.pcss`
      }
    )
    ok(task)

    yield Promise.resolve(task(ctx))

    ok(require('../tmp/testing/mock-react'))
  }))

  it('Watch', () => co(function * () {
    let ctx = ponContext({})
    let srcDir = `${__dirname}/../tmp/testing-watching/src`
    let destDir = `${__dirname}/../tmp/testing-watching/dest`
    let src = srcDir + '/foo.jsx'
    yield writeout(src, 'export default () => (<div />)', { mkdirp: true })
    yield asleep(100)
    define(srcDir, destDir, { watchDelay: 1 }).watch(ctx)
    yield writeout(src, 'export default () => (<span />)', { mkdirp: true })
    yield asleep(300)
    yield writeout(src, 'export default () => (<h3 />)', { mkdirp: true })
    yield asleep(300)
  }))
})

/* global describe, before, after, it */
