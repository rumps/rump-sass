'use strict';

var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var rump = require('rump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task(rump.taskName('build:sass'), function() {
  var sourcePath = path.join(rump.configs.main.paths.source.root,
                             rump.configs.main.paths.source.sass);
  var source = path.join(sourcePath, rump.configs.main.globs.build.sass);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.sass);
  var sourceMap = rump.configs.main.styles.sourceMap;

  return gulp
    .src([source].concat(rump.configs.main.globs.global))
    .pipe((rump.configs.watch ? plumber : util.noop)())
    .pipe((sourceMap ? sourcemaps.init : util.noop)())
    .pipe(sass(rump.configs.sass))
    .pipe(autoprefixer(rump.configs.autoprefixer))
    .pipe((sourceMap ? sourcemaps.write : util.noop)({
      sourceRoot: path.resolve(sourcePath)
    }))
    .pipe(gulp.dest(destination));
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:sass'));
