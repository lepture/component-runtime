require.register('foo/index.js', function(require, exports, module) {
  exports = module.exports = require('./bar');
  exports.bar = require('bar');
});

require.register('foo/bar/index.js', function(require, exports, module) {
  var baz = require('../baz');
  module.exports = {baz: baz};
});

require.register('foo/baz.js', function(require, exports, module) {
  module.exports = 'baz';
});

require.register('bar', function(require, exports, module) {
  module.exports = 'bar';
});

var foo = require('foo');
console.log(foo);
console.log(foo.bar);
