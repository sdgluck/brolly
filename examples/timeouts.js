const delay = require('delay')

const benchmark = require('../src')

const bench = benchmark('timeout', [
  [4000, function timeout (time, done) {
    setTimeout(done, time)
  }],
  ['delay', function delay (delay) {
    return delay(2000)
  }]
])

bench(100).print()
