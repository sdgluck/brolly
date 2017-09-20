const path = require('path')
const delay = require('delay')

const wait = path.resolve(__dirname, './wait')
const benchmark = require('../src')

const bench = benchmark('timeout', [
  [1000, function timeout (time, done) {
    setTimeout(done, time)
  }],
  [wait, function timeout (wait, done) {
    wait(done, 2000)
  }],
  ['delay', function delay (delay) {
    return delay(3000)
  }]
])

bench(100).print()
