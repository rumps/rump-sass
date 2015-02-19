'use strict';

var rump = module.exports = require('rump');
var configs = require('./configs');
var originalAddGulpTasks = rump.addGulpTasks;

// TODO remove on next major core update
rump.addGulpTasks = function(options) {
  originalAddGulpTasks(options);
  require('./gulp');
  return rump;
};

rump.on('update:main', update);
rump.on('update:images', update);

rump.on('gulp:main', function(options) {
  require('./gulp');
  rump.emit('gulp:sass', options);
});

Object.defineProperty(rump.configs, 'autoprefixer', {
  get: function() {
    return configs.autoprefixer;
  }
});

Object.defineProperty(rump.configs, 'sass', {
  get: function() {
    return configs.sass;
  }
});

function update() {
  configs.rebuild();
  rump.emit('update:sass');
}
