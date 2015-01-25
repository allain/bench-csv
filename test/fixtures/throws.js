var benchmark = require('../..');

benchmark(function() {
	return {};
}, function(n, cb) {
  throw new Error('throwing');
});
