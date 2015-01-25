var child_process = require('child_process');
var async = require('async');
var fs = require('fs');

module.exports = function(command, cb) {
  // Run the command in a child_process 
  var p = child_process.exec(command);

  var output = [];

  var error = [];

  p.stdout.on('data', function(data) {
    output.push(data.toString());
  });

  p.stderr.on('data', function(data) {
    error.push(data.toString());
  });

  p.on('close', function(code) {
    if (code == 0) {
      cb(null, output.join(''));
    } else {
      cb(new Error('error running process'), error.join(''));
    }
  });
};
