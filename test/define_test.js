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
const fs = require('fs')
const filecopy = require('filecopy')

const co = require('co')

describe('define', function () {
  this.timeout(80000)

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

  it('Watch pcss', () => co(function * () {
    let ctx = ponContext()
    let mockDir = `${__dirname}/../misc/mocks`
    let srcDir = `${__dirname}/../tmp/testing-watching-pcss/src`
    let destDir = `${__dirname}/../tmp/testing-watching-pcss/dest`
    let extractCss = `${__dirname}/../tmp/testing/watching-bundle.pcss`
    yield filecopy(`${mockDir}/mock-react.jsx`, `${srcDir}/mock-react.jsx`, { mkdirp: true })
    yield filecopy(`${mockDir}/mock-react.pcss`, `${srcDir}/mock-react.pcss`, { mkdirp: true })
    define(srcDir, destDir, {
      pattern: [ '**/*.jsx' ],
      watchTargets: [ `${srcDir}/**/*.pcss` ],
      watchDelay: 1,
      extractCss
    }).watch(ctx)

    const writeFileAsync = (file, text) => new Promise((resolve, reject) => {
      fs.writeFile(
        file,
        text,
        { flag: 'a' },
        (err) => err ? reject(err) : resolve()
      )
    })

    yield asleep(500)

    yield writeFileAsync(
      `${srcDir}/mock-react.pcss`,
      '\n.one { color: red; }'
    )

    yield asleep(5000)

    yield writeFileAsync(
      `${srcDir}/mock-react.pcss`,
      '\n.two { color: red; }'
    )
    yield asleep(3000)
  }))
})

/* global describe, before, after, it */
