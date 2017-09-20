'use strict'

const path = require('path')
const fork = require('furck')
const assert = require('argsy')
const timer = require('tiny-tim')

module.exports = function brolly (name, benches, deps) {
  assert('brolly')
    .str(name, 'name')
    .optional.arr(name, 'benches')
    .optional.arr(deps, 'deps')

  const names = []

  if (Array.isArray(name)) {
    benches = name
  }

  return function bench (iterations) {
    if (iterations < 1) {
      throw new Error('Expecting iterations to be positive integer')
    }

    const time = timer('ms', true)

    const p = Promise.all(benches.map((bench, i) => {
      let libraries = []

      if (Array.isArray(bench) && Array.isArray(deps)) {
        throw new Error('must use either shared or unique deps')
      } else if (Array.isArray(deps) && deps.length) {
        libraries = deps
      } else if (Array.isArray(bench)) {
        libraries = bench
        bench = bench.pop()
      }

      assert.fn(bench, 'bench fn')
      names.push(bench.name || 'bench ' + (i + 1))

      const fn = bench.toString()
      const worker = path.resolve(__dirname, './worker')

      return fork(worker)
        .send({iterations, libraries, fn})
        .catch((err) => {
          console.log(`error in "${bench.name}"`)
          console.log(err)
          process.exit(1)
        })
    }))

    const api = {
      print () {
        if (name) {
          console.log(`"${name}" benchmark`)
        }

        console.log(`running ${iterations} iteration${iterations > 1 ? 's' : ''}...`)

        p.then((result) => {
          console.log(`total ${time()}\n`)
          result.forEach((obj, i) => {
            if (obj.success) {
              const {avgExecTime, opsPerSec} = obj.result
              console.log(`- ${names[i]}:`)
              console.log(`    avg time: ${avgExecTime}ms`)
              console.log(`     ops/sec: ${opsPerSec}`)
            } else {
              console.log(`- ${names[i]}:`)
              console.log(`    failed (${obj.error})`)
            }
            console.log()
          })
        })
        return api
      },
      then (...args) {
        return p.then(...args)
      }
    }

    return api
  }
}
