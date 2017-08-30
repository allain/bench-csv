const generateId = require('shortid').generate

const defaultOptions = {
  warmups: 10,
  repeat: 100
}

async function perform (fn, args) {
  return fn(args)
}

async function repeatFn (fn, startArg, n) {
  let result = startArg

  for (let i = 0; i < n; i++) {
    result = await perform(fn, result)
  }

  return result
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function measure (fn, options = {}) {
  let memoryStart
  let memoryEnd

  global.gc()
  await delay(1)
  memStart = process.memoryUsage()

  let timeStart = Date.now()

  await perform(fn)

  const measurement = {
    pid: process.pid,
    timestamp: new Date().toISOString(),
    duration: Date.now() - timeStart
  }

  const memEnd = process.memoryUsage()
  measurement.memory = Math.max(
    0,
    memEnd.external -
      memStart.external +
      memStart.rss -
      memStart.rss +
      memStart.heapUsed -
      memEnd.heapUsed
  )

  return measurement
}

async function benchmark (fn, options = {}) {
  options = Object.assign({}, defaultOptions, options)
  if (!global.gc) throw new Error('node must be invoked with --expose-gc')

  if (options.beforeAll) {
    await perform(options.beforeAll, options)
  }

  await repeatFn(fn, [], options.warmups)

  let stats = []

  let batchId = null

  await repeatFn(
    async () => {
      if (options.before) await perform(options.before, options)

      let measurements = await measure(fn, options)

      if (options.after) await perform(options.after, options)

      if (options.repeat > 1) {
        // Include batch in stats output
        measurements.batch = batchId || (batchId = generateId())
      }
      stats.push(measurements)
    },
    [],
    options.repeat
  )

  if (options.afterAll) {
    await perform(options.afterAll, options)
  }

  return stats
}

benchmark.measure = measure

module.exports = benchmark
