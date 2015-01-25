/*global describe, it */
'use strict';

var assert = require('assert');

var benchmark = require('../');

var processRunner = require('../process-runner.js');

describe('bench-csv node module', function() {
  it('complains if benchmark is not given a number', function(done) {
    processRunner('node ' + __dirname + '/fixtures/count-to-n.js', function(err, output) {
      assert(!!err, 'expected error');
      assert(/^usage: /.test(output), 'expected usage error but there was none');
      done();
    });
  });

  it('assumes step 1 if none given', function(done) {
    processRunner('node ' + __dirname + '/fixtures/count-to-n.js 10', function(err, output) {
      assert(!err, err);
      // expected line count to be 11 (1 header + 11 trials)
      assert.equal(output.trim().split(/[\r\n]+/).length, 12);
      done();
    });
  });

  it('respects step when given', function(done) {
    processRunner('node ' + __dirname + '/fixtures/count-to-n.js 10 2', function(err, output) {
      assert(!err, err);
      // expected line count to be 11 (1 header + 6 trials)
      assert.equal(output.trim().split(/[\r\n]+/).length, 7);
      done();
    });
  });

  it('respects no header flag', function(done) {
    processRunner('node ' + __dirname + '/fixtures/count-to-n.js 10 2 --noheader', function(err, output) {
      assert(!err, err);
      // expected line count to be 11 (0 header + 6 trials)
      assert.equal(output.trim().split(/[\r\n]+/).length, 6);
      done();
    });
  });
});