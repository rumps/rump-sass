'use strict';

var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var rump = require('rump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task('rump:build:sass', function() {
  var source = path.join(rump.configs.main.paths.source.root,
                         rump.configs.main.paths.source.sass,
                         rump.configs.main.globs.build.sass);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.sass);

  return gulp
  .src([source].concat(rump.configs.main.globs.global))
  .pipe((rump.configs.watch ? plumber : util.noop)())
  .pipe((rump.configs.main.styles.sourceMap ? sourcemaps.init : util.noop)())
  .pipe(sass(rump.configs.sass))
  .pipe(autoprefixer(rump.configs.autoprefixer))
  .pipe((rump.configs.main.styles.sourceMap ? sourcemaps.write : util.noop)())
  .pipe(gulp.dest(destination));
});

gulp.tasks['rump:build'].dep.push('rump:build:sass');
