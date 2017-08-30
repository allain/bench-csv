const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = function () {
  const b = Buffer.alloc(Math.round(Math.random() * 100 * 1024 * 1024))
  return delay(Math.round(Math.random() * 100))
}
