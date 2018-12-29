//@flow
'use strict'

const assert = require('assert')

@annotation
class MyClass {}

function annotation (classDescriptor) {
  const { kind, elements } = classDescriptor
  return {
    kind,
    elements: [
      ...elements,
      {
        kind: 'method',
        key: 'annotation',
        placement: 'own',
        descriptor: {
          get: () => true,
          enumerable: true,
          configurable: false,

        }
      }
    ]
  }
}

@isTestable(true)
class MyClass2 {
}

function isTestable (enabled) {
  return function decorator (classDescriptor) {
    const { kind, elements } = classDescriptor
    return {
      kind,
      elements: [
        ...elements,
        {
          kind: 'method',
          key: 'testable',
          placement: 'own',
          descriptor: {
            get: () => enabled,
            enumerable: true,
            configurable: false,
          }
        }
      ]
    }
  }
}

class C {
  @enumerable(false)
  method () { }

  @enumerable(true)
  method2 () { }
}

function enumerable (enabled = true) {
  return function (elementDescriptor) {
    const { kind, key, descriptor, placement, } = elementDescriptor
    return {
      descriptor: {
        ...descriptor,
        enumerable: enabled,
      },
      placement: 'own',
      key,
      kind,
    }
  }
}

const c = new MyClass()
assert('c.annotation', c.annotation)

const c2 = new MyClass2()
assert('c2.testable', c2.testable)

assert.deepEqual(Object.keys(new C()), ['method2'])
