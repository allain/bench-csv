var benchmark = require('../..');
var microtime = require('microtime');
benchmark(function() {
  return {
    time: microtime.now()
  };
}, function(n, cb) {
  var count = 0;
  for (var i = 1; i <= n; i++) {
    count++;
  }

  cb();
});