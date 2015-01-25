var async = require('async');

var argv = require('minimist')(process.argv.slice(2));
var child_process = require('child_process');
var processRunner = require('./process-runner.js');
var fs = require('fs');

module.exports = benchmark;

function benchmark(measureFn, fn) {
  var n = parseInt(argv.n, 10);
  if (n || n === 0) {
    var startMeasurement = measureFn();

    return fn(n, function(cb) {
      var endMeasurement = measureFn();
      var row = [n];
      Object.keys(endMeasurement).forEach(function(key) {
        row.push(endMeasurement[key] - startMeasurement[key]);
      });
      emitRow(row);
    });
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
    if (err) console.error(err);
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