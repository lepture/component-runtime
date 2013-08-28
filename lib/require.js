
/**
 * Require the given path.
 */
function require(path, parent) {
  if (parent && path.charAt(0) === '.') {
    path = require.normalize(parent, path);
  }
  var resolved = require.resolve(path);

  if (!resolved) {
    parent = parent || 'root';
    throw new Error('Failed to require "' + path + '" from "' + parent + '"');
  }

  var mod = require.modules[resolved];

  if (!mod.exports) {
    mod.exports = {}
    mod.call(mod.exports, require.relative(resolved), mod.exports, mod);
  }

  return mod.exports;
};

/**
 * Storage for registered modules.
 */
require.modules = {};

/**
 * Resolve `path`.
 */
require.resolve = function(path) {
  if (path.charAt(0) === '/') {
    path = path.slice(1);
  }

  var paths = [
    path,
    path + '.js',
    path + '/index.js'
  ]

  for (var i=0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
  }
};

require.normalize = function(curr, path) {
  var segs = [];

  if (path.charAt(0) !== '.') {
    return path;
  }

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; i++) {
    if (path[i] === '..') {
      curr.pop();
    } else if (path[i] !== '.' && path[i] !== '') {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with `definition`.
 */
require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Return a require function relative to the `parent` path.
 */
require.relative = function(parent) {
  parent = parent.split('/');
  parent.pop();

  return function(path) {
    return require(path, parent.join('/'));
  };
};
