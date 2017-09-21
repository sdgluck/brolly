<p align="center">
  <img src="https://github.com/sdgluck/brolly/blob/master/assets/umbrella.png" />
</p>

<p><h1 align="center">brolly</h1></p>

<p align="center">Benchmark in style</p>

<p align="center">Made with ❤ at <a href="http://www.twitter.com/outlandish">@outlandish</a></p>
  
<p align="center">
    <a href="http://badge.fury.io/js/brolly"><img alt="npm version" src="https://badge.fury.io/js/brolly.svg" /></a>
</p>

<hr/>

Run benchmarking functions in parallel...

- runs each bench in its own process using [furck](https://github.com/sdgluck/furck)
- benchmark avg. execution [time](https://github.com/sdgluck/tiny-tim) & operations/sec
- pass module dependencies to bench functions
- pass serialisable values

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

### `benchmark(name, [deps, ]benches) : Function`

Create a benchmark suite.

- __name__ {String} name of the benchmark suite
- __deps__ {Array} _(optional)_ shared bench deps
- __benches__ {Array} array of benchmark functions

An element of `benches` should be a function or an array:

- if a function, this will be the bench function
- if an array, the last element should be the bench function and all
previous elements should be unique dependencies of that bench, which will
override any deps given as `deps` to the suite

Returns a bench function.

### `bench(iterations) : self`

Run the benchmark suite.

- __iterations__ {Number} number of times to run each bench function

Returns self.

### `bench.print() : self`

Log the results to the console after completion.

Returns self.

## Example

```js
import benchmark from 'brolly'

const bench = benchmark('timeout', [
  // use done callback and pass serialisable value to bench fn
  [1000, function timeout (time, done) {
    setTimeout(done, time)
  }],
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



