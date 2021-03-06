var fs = require('fs');
var Batch = require('batch');
var Builder = require('component-builder');
var debug = require('debug')('component:builder');

var requirejs = fs.readFileSync(__dirname + '/lib/require.js', 'utf8');


function register(builder, file, js) {
  var main = builder.config.main, prefix;
  if (main && main !== 'index.js' && isMatch(builder.config.main, file)) {
    prefix = builder.config.name;
  }

  if (builder.config.scripts.length === 1) {
    file = builder.config.name;
  } else {
    file = builder.config.name + '/' + file;
  }

  if (builder.sourceUrls) {
    js = JSON.stringify(js + '//@ sourceURL=' + file);
    js = js.replace(/\\n/g, '\\n\\\n');
    js = 'require.register("' + file + '", Function("exports, require, module",\n'
      + js
      + '\n));';
  } else {
    js = 'require.register("' + file + '", function(exports, require, module){\n'
      + js
      + '\n});';
  }

  if (prefix) {
    js += '\nrequire.main("' + builder.config.name + '", "' + file + '");';
  }

  return js;
}


Builder.prototype.build = function(fn) {
  var self = this;
  var batch = new Batch;
  debug('building %s', this.dir);
  batch.push(this.buildScripts.bind(this));
  batch.push(this.buildTemplates.bind(this));
  batch.push(this.buildStyles.bind(this));
  batch.push(this.buildImages.bind(this));
  batch.push(this.buildFonts.bind(this));
  batch.push(this.buildFiles.bind(this));
  batch.end(function(err, res){
    if (err) return fn(err);

    var scripts = res.shift();
    var require = res.shift();
    var custom = self._js;
    var js = [scripts, require, custom].filter(empty).join('\n')

    fn(null, {
      js: js,
      css: res.shift(),
      images: res.shift(),
      fonts: res.shift(),
      files: res.shift(),
      require: requirejs
    });
  });
};

Builder.prototype.buildScripts = function(fn){
  this.buildType('scripts', fn, register);
};


function empty(s) {
    return '' != s;
}

function isMatch(a, b) {
  a = a.replace(/^\.\//, '');
  b = b.replace(/^\.\//, '');
  return a === b;
}

module.exports = Builder;
