'use strict'

import React from 'react'
import j from './mock-json.json'

const SomeComponent = ({ id }) => (
  <div id={id}>HogeHoge</div>
)

const a = { foo: 1 }
const b = { ...a }

console.log(a?.foo)

export default SomeComponent
