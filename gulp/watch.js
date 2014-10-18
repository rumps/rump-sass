'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task('rump:watch:sass', ['rump:build:sass'], function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.sass,
                       rump.configs.main.globs.watch.sass);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             ['rump:build:sass']);
});

gulp.tasks['rump:watch'].dep.push('rump:watch:sass');
