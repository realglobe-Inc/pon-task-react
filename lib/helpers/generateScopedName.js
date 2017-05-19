'use strict'

const path = require('path')
const crypto = require('crypto')

const token = () => crypto.randomBytes(5).toString('hex')
const withoutExt = (filename) => path.join(
  path.dirname(filename),
  path.basename(filename, path.extname(filename))
)

function generateScopedName (name, filename, css) {
  if (/^:/.test(name)) {
    return name
  }
  let where = path.basename(withoutExt(filename)).replace(/\//g, '_')
  return `${where}__${name}____${token()}`
}

module.exports = generateScopedName
