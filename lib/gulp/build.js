'use strict';

var convert = require('convert-source-map');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var util = require('gulp-util');
var path = require('path');
var rump = require('rump');
var through = require('through2');
var PluginError = util.PluginError;
var protocol = process.platform === 'win32' ? 'file:///' : 'file://';

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
    .pipe(sass(rump.configs.sass).on('error', function(err) {
      var pluginErr = new PluginError(rump.taskName('build:sass'), err);
      util.log(pluginErr.toString());
      this.emit('end');
    }))
    .pipe(autoprefixer(rump.configs.autoprefixer))
    .pipe((sourceMap ? sourcemaps.write : util.noop)())
    .pipe(sourceMap ? through.obj(sourceMapRewriter) : util.noop())
    .pipe(gulp.dest(destination));

  // Clear out autoprefixer's data and fix paths to match original
  function sourceMapRewriter(file, enc, callback) {
    if(file.isNull()) {
      return callback(null, file);
    }

    var content = file.contents.toString();
    var sourceMap = convert.fromSource(content);
    var sources = sourceMap.getProperty('sources').slice(1);
    var sourcesContent = sourceMap.getProperty('sourcesContent').slice(1);
    sources = sources.map(rewriteUrl);
    sourceMap.setProperty('sourceRoot', null);
    sourceMap.setProperty('sources', [''].concat(sources));
    sourceMap.setProperty('sourcesContent', [''].concat(sourcesContent));
    content = convert.removeComments(content) +
      '\n/*# sourceMappingURL=data:application/json;base64,' +
      sourceMap.toBase64() +
      ' */';
    file.contents = new Buffer(content);
    callback(null, file);
  }

  function rewriteUrl(url) {
    return protocol + path.resolve(sourcePath, url).split(path.sep).join('/');
  }
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:sass'));
