const
    path = require('path'),
    gulp = require('gulp'),
    ts = require('gulp-typescript'),
    tsc = ts.createProject('tsconfig.json'),
    conf = require('./conf'),

    browserSync = require('browser-sync'),

    $ = require('gulp-load-plugins')();


function buildTypeScripts() {
  return tsc.src()
      .pipe(tsc())
      .js.pipe(gulp.dest(conf.paths.tmpTS));
}

function buildScripts() {
  buildTypeScripts();
  return gulp.src([
        path.join(conf.paths.tmpTS, '/lib/stand.js'),
        path.join(conf.paths.tmpTS, '/lib/**/*.js'),
        path.join(conf.paths.tmpTS, '/**/*.js')
      ])
      .pipe($.size());
}


gulp.task('scripts-reload', function() {
  return buildScripts()
      .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});
