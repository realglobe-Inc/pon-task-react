'use strict'

const path = require('path')

module.exports = function processCss (data, filename) {
  switch (path.extname(filename)) {
    case '.pcss': {
      return data.replace(/\\--/g, '--')
    }
    default:
      return data
  }
}
