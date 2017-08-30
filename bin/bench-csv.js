#!/usr/bin/node --expose-gc

const path = require('path')
const { promisify } = require('util')
const buildCommand = require('../src/build-command')
const nodemon = require('nodemon')
const exists = promisify(require('fs').exists)
const appendFile = promisify(require('fs').appendFile)

const delay = ms =>
  new Promise(resolve => setTimeout(() => resolve(Date.now()), ms))

const bm = require('../')
const buildCsv = require('../src/build-csv')

const args = require('minimist')(process.argv, {
  boolean: ['header', 'watch', 'watching', 'inspect'],
  default: {
    delay: 1,
    header: true,
    watch: false,
    watching: false,
    inspect: false,
    warmups: 0,
    repeat: 1,
    delim: ','
  }
})

async function prepareOptions (cmdLineOptions) {
  let target = cmdLineOptions._[2]
  if (!target) {
    console.error('no target specified')
    console.error('usage: bench-csv target [options]')
    process.exit(1)
  }

  let targetPath = path.resolve(process.cwd(), target)
  if (!exists(targetPath)) throw new Error(`not found: ${targetPath}`)

  const targetSpec = require(targetPath)
  let options
  if (typeof targetSpec === 'function') {
    options = cmdLineOptions
    target = targetSpec
  } else if (!Array.isArray(targetSpec) && typeof targetSpec === 'object') {
    options = Object.assign({}, cmdLineOptions, targetSpec)
    target = options.run
  } else {
    throw new Error('target did not export a function or object')
  }

  if (!target) {
    throw new Error(
      'function to benchmark not found in target, did you forget "run" property?'
    )
  }

  options.targetPath = targetPath

  return { target, options }
}

async function emitStats (stats, options) {
  const delim = JSON.parse('"' + options.delim + '"')
  const emitHeader = options.header && (!options.o || !await exists(options.o))
  if (options.o) {
    // Write to file
    await appendFile(
      path.resolve(process.cwd(), options.o),
      buildCsv(stats, delim, emitHeader) + '\n',
      'utf-8'
    )
  } else {
    console.log(buildCsv(stats, delim, emitHeader))
  }
}

prepareOptions(args)
  .then(async ({ target, options }) => {
    let i = 0
    do {
      let stats = await bm(target, options)
      await emitStats(stats, options)
      options.header = false
    } while (options.watching && (await delay(options.delay * 1000)))

    if (options.watch) {
      await delay(options.delay * 1000)

      let newOptions = {
        ...options,
        _: [path.relative(process.cwd(), __filename), options.targetPath],
        header: false,
        watch: false,
        watching: true // so that children know they're being watched and wil lrun forever
      }

      nodemon(
        '--expose-gc ' +
          (options.inspect ? '--inspect ' : '') +
          buildCommand(newOptions)
      )
    }
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
