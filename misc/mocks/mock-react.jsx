'use strict'

import React from 'react'
import css from './mock-react.pcss'

const SomeComponent = ({ id }) => (
  <div className={css.hoge} id={id}>HogeHoge</div>
)

export default SomeComponent