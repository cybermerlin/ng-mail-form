const gulp = require('gulp'),
    zip = require('gulp-zip'),
    prompt = require('gulp-prompt'),
    rename = require('gulp-rename');

gulp.task('marketplace-release', ['build', 'dev-release'], function() {
  return gulp.src('')
      .pipe(prompt.prompt({
        type: 'input',
        name: 'version',
        message: 'Please enter release version (x.x.x)'
      }, function(res) {
        const nameAndVersion = 'Core' + res.version;
        return gulp
            .src([
                  'src/**', 'out/**', 'dev-release/**', 'gulp/**', 'gulpfile.js',
                  'package.json', 'README.md', '.gitignore', '.hgignore'
                ],
                {base: "."})
            .pipe(rename(function(path) {
              path.dirname = nameAndVersion + '/' + path.dirname;
            }))
            .pipe(zip(nameAndVersion + '.zip'))
            .pipe(gulp.dest('.'));
      }));

});
