var gulp        = require('gulp');

var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint   = require('stylelint');
var tinylr      = require('tiny-lr')();

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('livereload', function() {
    tinylr.listen(35729);
});

gulp.task('sass:dist', function () {
    var sass = require('gulp-sass');

    gulp.src('assets/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task("sass:lint", function() {
    var processors = [
        stylelint(),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];

    return gulp.src([
            'sass/**/*.scss',
            '!sass/vendor/**/*.scss']
        )
        .pipe(postcss(processors, { syntax: syntax_scss }));
});

gulp.task('server', function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')({port: 35729}));
    app.use(express.static("_site"));
    app.listen(8000, '0.0.0.0');
});

gulp.task('watch', function() {
    gulp.watch(['assets/scss/**/*.scss'], ['sass']);
    gulp.watch(['_site/**'], notifyLiveReload);
});

gulp.task('default', ['sass:dist', 'server', 'livereload', 'watch']);
gulp.task('travis', ['sass:lint']);
gulp.task('deploy', ['sass:dist']);
