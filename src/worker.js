'use strict'

const timer = require('tiny-tim')

let called = false

function success (result) {
  process.send({success: true, result})
  process.exit(0)
}

function failure (error) {
  process.send({success: false, error: error.message})
  process.exit(0)
}

process.on('message', ({fn, iterations, libraries}) => {
  if (called) {
    return
  }

  called = true

  try {
    const bench = new Function(`return ${fn}`)()
    const time = timer('ms')

    const inject = libraries.map((val) => {
      if (typeof val === 'string') {
        try {
          return require(val)
        } catch (err) {}
      }
      return val
    })

    console.log(inject)

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
