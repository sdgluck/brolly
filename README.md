# brolly

> benchmark in style

Run benchmarking functions in parallel.

## Install

```sh
npm install --save brolly
```

```sh
yarn add brolly
```

## Import

```js
// ES2015
import benchmark from 'brolly'
```

```js
// CommonJS
var benchmark = require('brolly')
```

## API

### `benchmark(benches) : Function`

Execute a suite of benchmark functions.

- __name__ {String} name of the benchmark suite
- __benches__ {Array} array of benchmark functions

Returns a `bench`.

### `bench.print() : self`

Log the results to the console after completion.

## Example

```js
import benchmark from 'brolly'

const bench = benchmark('wait', [
  // use done callback
  function setTimeout (done) {
    setTimeout(done, 1000)
  },
  // request "delay" lib to be injected into bench fn
  // return Promise instead of calling done callback
  ['delay', function sleep (delay) {
    return delay(1000)
  }]
])

// run each bench 1000 times and then print the results
bench(1000).print()
```

## Contributing

All pull requests and issues welcome!

If you're not sure how, check out the [great video tutorials on egghead.io](http://bit.ly/2aVzthz)!

## License

MIT © [Sam Gluck](https://github.com/sdgluck)



