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

    const inject = libraries.map((val) => {
      if (typeof val === 'string') {
        try {
          return require(val)
        } catch (err) {}
      }
      return val
    })

    const runTime = timer('s')
    let execTime = 0
    let completed = 0

    for (let i = 0; i < iterations; i++) {
      const time = timer('ms')
      let cbCalled = false

      const done = () => {
        if (cbCalled) {
          throw new Error('done called twice')
        }

        cbCalled = true
        execTime += time()

        if (++completed === iterations - 1) {
          success({
            avgExecTime: parseInt(execTime / iterations),
            opsPerSec: (iterations / runTime()).toLocaleString(undefined, {maximumFractionDigits: 0})
          })
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
