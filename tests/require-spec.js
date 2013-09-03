require.register('foo/index.js', function(exports, require, module) {
  console.log('fooindex')
  exports = module.exports = require('./bar');
  exports.bar = require('bar');
});

require.register('foo/bar/index.js', function(exports, require, module) {
  var baz = require('../baz');
  module.exports = {baz: baz};
});

require.register('foo/baz.js', function(exports, require, module) {
  module.exports = 'baz';
});

require.register('bar', function(exports, require, module) {
  module.exports = 'bar';
});

var foo = require('foo');
console.log(foo);
console.log(foo.bar);
