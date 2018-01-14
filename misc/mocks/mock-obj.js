'use strict'

@annotation
class MyClass {}

function annotation (target) {
  target.annotated = true
}

@isTestable(true)
class MyClass2 {
}

function isTestable (value) {
  return function decorator (target) {
    target.isTestable = value
  }
}

