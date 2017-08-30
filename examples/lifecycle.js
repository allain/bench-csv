// Runs before the batch of benchmarks are run
module.exports.beforeAll = () => Promise.resolve('BEFORE ALL')

// Runs before each benchmarks
module.exports.before = () => Promise.resolve('BEFORE')

// Code being Benchmarked. The only export required from an object benchmark spec
module.exports.run = () => Promise.resolve('RUNNING')

// Runs before each benchmarks
module.exports.after = () => Promise.resolve('AFTER')

// Runs after all runs in the batch of benchmarks are run
module.exports.beforeAll = () => Promise.resolve('AFTER ALL')
