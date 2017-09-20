'use strict'

const timer = require('tiny-tim')

let called = false

function success (result) {
  process.send({success: true, result})
  process.exit(0)
}

function failure (error) {
  process.send({success: false, error})
  process.exit(1)
}

process.on('message', ({fn, iterations, libraries}) => {
  if (called) {
    return
  }

  called = true

  try {
    const inject = libraries.map(require)
    const bench = new Function(`return ${fn}`)()
    const time = timer('ms')

    let sum = 0

    for (let i = 0; i < iterations; i++) {
      let cbCalled = false

      const done = () => {
        if (cbCalled) {
          return
        }

        cbCalled = true
        sum += time()

        if (i === iterations - 1) {
          success(parseInt(sum / iterations))
        }
      }

      const ret = bench(...inject, done)
      if (ret && typeof ret.then === 'function') {
        ret.then(done)
      }
    }
  } catch (err) {
    failure(err)
  }
})