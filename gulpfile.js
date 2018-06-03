const
    gulp = require('gulp'),
    path = require('path'),

    dir = path.join(__dirname, 'gulp');


require('gulp-require-tasks')({
  path: dir,
  separate: '.'
});


gulp.task('default', ['clean', 'build.app']);
