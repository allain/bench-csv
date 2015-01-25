var benchmark = require('../..');

benchmark(function() {
	return {};
}, function(n, cb) {
	cb(new Error('error'));
});
