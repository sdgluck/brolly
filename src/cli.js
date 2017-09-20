#!/usr/bin/env node
'use strict'

const benchmark = require('./index')
const log = require('carbonate-logger')
const logUpdate = require('log-update')
const ora = require('ora')

function makeLogs () {
  return benches.reduce((str, bench, i) => {
    let msg = `\n${spinners[i].frame()} ${bench.name}`

    if (times[i].success) {
      msg += `: ${times[i].result}`
    } else {
      msg += `: error`
    }

    return str + msg
  }, '')
}

function timestamp () {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
}

function done () {
  log.info('finished at %s(grey)', timestamp())
}

const spinners = new Array(benches.length).fill().map(() => ora())
const times = new Array(benches.length).fill(null)
let completed = 0

log.info('started at %s(grey)', timestamp())

setTimeout(() => logUpdate(makeLogs()), 500)

benchmark().then(done)
