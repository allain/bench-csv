const bm = require('./')

/* describe('bench-csv', function() {
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

  it('benchmarking throws are caught and complained about', function(done) {
    processRunner('node ' + __dirname + '/fixtures/throws.js 10', function(err, output) {
      assert(!!err, 'expected error');
			assert.equal(err.message, 'error running process');
      done();
    });
  });

  it('benchmarking error is complained about', function(done) {
    processRunner('node ' + __dirname + '/fixtures/errors.js 10', function(err, output) {
      assert(!!err, 'expected error');
			assert.equal(err.message, 'error running process');
      done();
    });
  });
});
*/

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('benchmark', () => {
  it('works with a synchronous func', () => {
    return bm(() => 10).then(stats => {
      expect(Array.isArray(stats)).toBeTruthy()
    })
  })

  it('works with a resolving function', () => {
    return bm(() => Promise.resolve()).then(stats => {
      expect(Array.isArray(stats)).toBeTruthy()
    })
  })

  describe('measurements', () => {
    it('exposes measure function', () => {
      expect(typeof bm.measure).toBe('function')
    })

    it('measures duration by default', () =>
      measure(() => delay(100)).then(m => {
        expect(typeof m.duration).toBe('number')
      }))
  })

  describe('options', () => {
    it('warmups', () => {
      let count = 0
      return bm(() => count++, { warmups: 11, repeat: 6 }).then(() => {
        expect(count).toBe(17)
      })
    })

    it('repeat', () => {
      let count = 0
      return bm(() => count++, { warmups: 5, repeat: 10 }).then(() => {
        expect(count).toBe(15)
      })
    })

    it('before', () => {
      let setup = 0
      return bm(() => undefined, {
        warmups: 5,
        repeat: 10,
        before: () => setup++
      }).then(() => {
        expect(setup).toBe(10)
      })
    })

    it('after', () => {
      let teardown = 0
      return bm(() => undefined, {
        warmups: 5,
        repeat: 10,
        after: () => teardown++
      }).then(() => {
        expect(teardown).toBe(10)
      })
    })

    it('beforeAll', () => {
      let setup = 0
      return bm(() => undefined, {
        warmups: 5,
        repeat: 10,
        beforeAll: () => setup++
      }).then(() => {
        expect(setup).toBe(1)
      })
    })

    it('afterAll', () => {
      let setup = 0
      return bm(() => undefined, {
        warmups: 5,
        repeat: 10,
        afterAll: () => setup++
      }).then(() => {
        expect(setup).toBe(1)
      })
    })
  })
})
