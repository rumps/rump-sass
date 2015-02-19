'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task(rump.taskName('watch:sass'),
          [rump.taskName('build:sass')],
          function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.sass,
                       rump.configs.main.globs.watch.sass);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             [rump.taskName('build:sass')]);
});

gulp.tasks[rump.taskName('watch')].dep.push(rump.taskName('watch:sass'));
