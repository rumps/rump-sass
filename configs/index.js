'use strict';

var extend = require('extend');
var path = require('path');
var rump = require('rump');

exports.rebuild = function() {
  var sassDefaults;

  rump.configs.main.globs = extend(true, {
    build: {
      sass: '*.scss'
    },
    watch: {
      sass: '**/*.scss'
    }
  }, rump.configs.main.globs);

  rump.configs.main.paths = extend(true, {
    source: {
      sass: 'styles'
    },
    destination: {
      sass: 'styles'
    }
  }, rump.configs.main.paths);

  rump.configs.main.styles = extend(true, {
    minify: rump.configs.main.environment === 'production',
    sourceMap: rump.configs.main.environment === 'development'
  }, rump.configs.main.styles);

  sassDefaults = {
    includePaths: [
      'node_modules',
      'bower_components',
      path.join(rump.configs.main.paths.source.root,
                rump.configs.main.paths.source.sass)
    ]
  };
  if(rump.configs.main.paths.destination.images) {
    sassDefaults.imagePath = path.relative(
      rump.configs.main.paths.destination.sass,
      rump.configs.main.paths.destination.images);
  }
  if(rump.configs.main.style.minify) {
    sassDefaults.outputStyle = 'compressed';
  }

  exports.autoprefixer = extend(true, {},
                                rump.configs.main.styles.autoprefixer);
  exports.sass = extend(true, sassDefaults, rump.configs.main.styles.sass);
};

exports.rebuild();
