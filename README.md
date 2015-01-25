#bench-csv
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

benchmarking tool that spits its results out in csv format.

Each run of the code being benchmarked is done in a separate process to minimize interference.

## Install

```sh
$ npm install --save bench-csv
```

## Usage

**Step 1:** Write your benchmark
```js
// example1.js (could be named anything)
var benchmark = require('bench-csv');
var microtime = require('microtime');

var counter = 0;

// Calculate the metrics snapshot
function measureMetrics() {
	return {
		time: microtime.now(),
		rss: process.memoryUsage().rss,
		counter: counter
	};
}

// perform the work being benchmarked n times
function performWorkAsync(n, done) {
	// Example nastiness here
	while (n-- > 0) {
		counter ++;
	}

	// Inform the benchmarking tool that we're done
	done();
}

benchmark(measureMetrics, performWorkAsync);
```

**Step 2:** Run your benchmarks

Run benchmark for n=0,1,2,3,...,1000
```bash
node example1.js 1000
```

Run benchmark for n=0,100,200,...,1000 (note skip param)
```bash
node example1.js 1000 100
```

Optinally you can ask for CSV headers to be omitted by using:
```bash
node example1.js --noheader 1000 100
```

If you are only interested in collecting the benchmarks for running the code N times you may use
```bash
node example1.js --n=1000
```




## License

ISC © Allain Lalonde


[npm-url]: https://npmjs.org/package/bench-csv
[npm-image]: https://badge.fury.io/js/bench-csv.svg
[travis-url]: https://travis-ci.org/allain/bench-csv
[travis-image]: https://travis-ci.org/allain/bench-csv.svg?branch=master
[daviddm-url]: https://david-dm.org/allain/bench-csv.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/allain/bench-csv
