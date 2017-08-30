#bench-csv
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

Simple benchmarking tool that spits its results out in csv format.

## Install

```sh
$ npm install -g bench-csv
```

## Usage

### Simple Example
**Step 1:** Write your benchmark

```js
# file: benchmark.js
// function being benchmarked
const randomDelay = ms => new Promise(resolve => setTimeout(resolve, Math.round(Math.random() * ms)))

// export it
module.exports = () => randomDelay(100)
```

**Step 2:** run bench-csv on it

`bench-csv ./path/to/benchmark.js`

outputs (changes every time it's run)
```
"pid","timestamp","memory","duration"
"8342","2017-08-30T14:24:13.416Z","66229821","38"
```

### Better Usage Example

Benchmark `slow-code.js` continously, running batches of 10 iterations with 5 warmups and waiting 60 seconds between runs:

```bash
bench-csv --watch --delay=60 --warmups=5 --repeat=10 slow-code.js -o slow-code.csv
```

Under the hood this uses nodemon to restart when the code being benchmarked changes.

The `-o` param tells *bench-csv* to send its results to the file targetted, creating it if missing.

## Command Line Options

--watch

    Runs the benchmark continously, accounting for changes in the target

--delay [seconds]

    When watching, how long to wait before each benchmark is performed. Defaults to 1 second

--repeat [1]

    How many iterations to perform each benchmark

--header [true]

    Whether to display the header row

--delim [',']

    Delimiter to use between columns of the CSV output. For tabs use `--delim="\t"` works too

--warmups[=0]

    Runs this many iterations before recording begins. Default to 0.

--inspect

    Enables remote debugging. What use would benchmarking be without profiling.

## Benchmark Lifecycles

Should you need it, *bench-csv* supports specifying lifecycle hooks as below:

```js
// slow-code-with-lifecycle.js

// Runs before each batch of iterations
module.exports.beforeAll = () => { ... }

// Runs before each iteration
module.exports.before = () => { ... }

// The function being benchmarked
module.exports.run = () => { ... }

// Runs after each iteration
module.exports.after = () => { ... }

// Runs after each batch of iterations
module.exports.afterAll = () => { ... }
```

Then you can benchmark it as before:

```bash
bench-csv --watch --repeat=10 --delay=60 ./path/to/slow-code-with-lifecycle.js
```

## License

ISC © Allain Lalonde


[npm-url]: https://npmjs.org/package/bench-csv
[npm-image]: https://badge.fury.io/js/bench-csv.svg
[travis-url]: https://travis-ci.org/allain/bench-csv
[travis-image]: https://travis-ci.org/allain/bench-csv.svg?branch=master
[daviddm-url]: https://david-dm.org/allain/bench-csv.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/allain/bench-csv
