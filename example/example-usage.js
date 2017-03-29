'use strict'

const pon = require('pon')
const react = require('pon-task-react')

async function tryExample () {
  let run = pon({
    // Compile js files under "ui" directory into "shim" directory
    'shim:ui': react('ui', 'shim', {
      pattern: [ '**/*.js', '**/*.jsx' ]
    })
  })

  run('shim:*')
}

tryExample()
