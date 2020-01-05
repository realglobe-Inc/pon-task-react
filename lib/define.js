'use strict'

const path = require('path')
const { byPattern } = require('pon-task-compile')
const { readFileAsync } = require('asfs')
const JSON5 = require('json5')

/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['env', 'react']] - Babel preset names
 * @param {string[]} [options.plugins=[]] - Babel plugin names
 * @param {string[]} [options.watchTargets=[]] - Additional watch target filenames
 * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
function define (srcDir, destDir, options = {}) {
  const {
    pattern = ['**/*.jsx', '**/*.js', '**/*.mjs', '**/*.json', '**/*.json5'],
    minified = false,
    esmodules = false,
    presets = [
      ['@babel/preset-flow'],
      ['@babel/preset-react', {}],
      ['@babel/preset-env', { targets: { browsers: ['> 1%'], }, modules: false }]
    ],
    watchTargets = [],
    plugins = [
      ...(esmodules ? ['@babel/plugin-syntax-dynamic-import'] : [
        '@babel/plugin-proposal-dynamic-import',
        '@babel/plugin-transform-modules-commonjs',
      ]),
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
    sourceMaps = 'inline',
    sourceRoot = path.relative(destDir, srcDir),
    watchDelay = 100,
    ext = '.js'
  } = options

  const compiler = async (code, inputSourceMap, options = {}) => {
    const { src, dest, watching } = options
    const isJson = path.extname(src) === '.json'
    if (isJson) {
      return [await readFileAsync(src)]
    }
    const isJSON5 = path.extname(src) === '.json5'
    if (isJSON5) {
      const data = JSON5.parse(await readFileAsync(src))
      return [JSON.stringify(data, null, 2)]
    }
    const babel = require('@babel/core') // Require here to reduce initial loading time
    const compiled = await new Promise((resolve, reject) =>
      babel.transform(code, {
        minified,
        presets,
        plugins,
        filename: src,
        filenameRelative: path.relative(process.cwd(), src),
        sourceMaps,
        sourceRoot,
        inputSourceMap: inputSourceMap || false
      }, (err, result) => err ? reject(err) : resolve(result))
    )
    return [compiled.code, compiled.map]
  }

  const task = byPattern(srcDir, destDir, compiler, {
    pattern,
    watchDelay,
    watchTargets,
    namer: (filename) => filename
      .replace(/\.mjs$/, ext)
      .replace(/\.jsx$/, ext)
      .replace(/\.json5$/, '.json')
  })

  const { watch } = task

  return Object.assign(function react (ctx) {
    return task(ctx)
  }, {
    watch: function watchDecorate (ctx) {
      const { logger } = ctx
      // Env check
      {
        const wanted = 'development'
        const actual = process.env.NODE_ENV
        if (wanted !== actual) {
          logger.warn(`NODE_ENV should be "${wanted}", but given: "${actual}"`)
        }
      }
      return watch.apply(this, arguments)
    }
  })
}

module.exports = define
