const delay = require('delay')

const benchmark = require('../src')

const bench = benchmark('timeout', [
  function timeout (done) {
    setTimeout(done, 4000)
  },
  ['delay', function delay (delay) {
    return delay(3000)
  }]
])

bench(100).print()
