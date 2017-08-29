var async = require('async')

var argv = require('minimist')(process.argv.slice(2))
var child_process = require('child_process')
var processRunner = require('./process-runner.js')
var fs = require('fs')

/* function benchmark(measureFn, fn) {
  var n = parseInt(argv.n, 10);
  if (n || n === 0) {
    var startMeasurement = measureFn();

		try {
			return fn(n, function(err) {
				if (err) {
					throw err;
				}

				var endMeasurement = measureFn();
				var row = [n];
				Object.keys(endMeasurement).forEach(function(key) {
					row.push(endMeasurement[key] - startMeasurement[key]);
				});
				emitRow(row);
			});
		} catch (e) {
			console.error(e);
      process.exit(1);
		}
  }

  var limit = parseInt(argv._[0], 10);
  if (!limit) {
    console.error('usage: node ' + require.main.filename + ' limit [step]');
    process.exit(1);
  }

  var step = parseInt(argv._[1], 10) || 1;
  var benched = buildTimestamp();
  var noheader = Boolean(argv.noheader);
  if (!noheader) {
    emitRow(['benched', 'n'].concat(Object.keys(measureFn())));
  }

  var index = 0;

  async.whilst(function() {
    return index <= limit;
  }, function(cb) {
    processRunner('node ' + require.main.filename + ' --n=' + index, function(err, output) {
      if (err) return cb(err);

      console.log('"' + benched + '",' + output.trim());
      index += step;
      cb();
    });

  }, function(err) {
    if (err) {
			console.error(err);
      process.exit(1);
		}
  });
}

function emitRow(values) {
  console.log('"' + values.join('","') + '"');
}

function buildTimestamp() {
  var now = new Date();
  var datePart = [
    now.getFullYear(),
    pad2Left(now.getMonth() + 1),
    pad2Left(now.getDate())
  ].join('-');

  var timePart = [now.getHours(), now.getMinutes(), now.getSeconds()].map(function(n) {
    return ('0' + n).substr(-2);
  }).join(':');

  return datePart + ' ' + timePart;
}

function pad2Left(n) {
  return ('0' + n).substr(-2);
}
*/

const defaultOptions = {
  time: true,
  memory: false,
  warmups: 10,
  repeat: 100
}

const noop = () => undefined

function perform (fn, args) {
  try {
    return Promise.resolve(fn(args))
  } catch (e) {
    return Promise.reject(e)
  }
}

function repeatFn (fn, startArg, n) {
  let result = Promise.resolve(startArg)

  for (let i = 0; i < n; i++) {
    result = result.then(args => perform(fn, args))
  }

  return result
}

function measure (fn, args, options = {}) {
  let start = Date.now()
  return perform(fn).then(() => {
    let end = Date.now()
    return {
      duration: end - start
    }
  })
}

function bm (fn, options = {}) {
  options = Object.assign({}, defaultOptions, options)

  return perform(options.beforeAll || noop, options)
    .then(() => repeatFn(fn, [], options.warmups)) // Warmups
    .then(() =>
      repeatFn(
        stats =>
          perform(options.before || noop, options)
            .then(() => measure(fn))
            .then(measurements =>
              perform(options.after || noop, options).then(() =>
                stats.concat([measurements])
              )
            ),
        [],
        options.repeat
      )
    )
    .then(stats => perform(options.afterAll || noop, options).then(() => stats))
}

bm.measure = measure

module.exports = bm
