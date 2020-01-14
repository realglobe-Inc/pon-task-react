'use strict'

import React from 'react'

const SomeComponent = ({ id }) => (
  <div id={id}>HogeHoge</div>
)

const a = { foo: 1 }
const b = { ...a }

console.log(a?.foo)

console.log('hoge', false ?? 'x')

void async function () {
  const { default: j } = await import('./mock-obj.js')
  console.log('dynamic j', j)
}()

export default SomeComponent
