const bm = require('./benchmark.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('benchmark', () => {
  it('works with a synchronous func', async () => {
    let stats = await bm(() => 10, {
      warmups: 11,
      repeat: 10
    })

    expect(Array.isArray(stats)).toBeTruthy()
  })

  it('works with a resolving function', async () => {
    let stats = await bm(
      () => {
        const b = Buffer.alloc(100 * 1024 * 1024)
        // return delay(10)
      },
      { warmups: 11, repeat: 10 }
    )

    expect(Array.isArray(stats)).toBeTruthy()
    expect(stats.length).toBe(10)

    const firstStat = stats[0]
    expect(typeof firstStat.timestamp).toBe('string')
    expect(typeof firstStat.duration).toBe('number')
    expect(typeof firstStat.memory).toBe('number')
    expect(typeof firstStat.pid).toBe('number')
  })

  describe('measurements', () => {
    it('exposes measure function', () => {
      expect(typeof bm.measure).toBe('function')
    })

    it('measurement has timestamp', () =>
      bm.measure(() => delay(10)).then(m => {
        expect(m.timestamp).toMatch(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}/
        )
      }))

    it('measures duration', () =>
      bm.measure(() => delay(10)).then(m => {
        expect(typeof m.duration).toBe('number')
      }))

    it('measures memory', async () => {
      let m = await bm.measure(() => {
        return Buffer.alloc(100 * 1024 * 1024, 'x')
      })

      expect(typeof m.memory).toBe('number')
      expect(m.memory).toBeGreaterThan(99 * 1024 * 1024)
      expect(m.memory).toBeLessThan(101 * 1024 * 1024)
    })
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
