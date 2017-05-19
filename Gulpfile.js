var gulp        = require('gulp');

var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint   = require('stylelint');
var tinylr      = require('tiny-lr')();
var uglify      = require('gulp-uglify');

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('modernizr', function () {
    var modernizr = require('gulp-modernizr');

    gulp.src('assets/js/*.js')
        .pipe(modernizr({
            "crawl": true,
            "customTests": [],
            "tests": [
                "canvas",
                "canvastext",
                "svg",
                "cssanimations",
                "csscalc",
                "csstransforms",
                "csstransitions",
                "cssvhunit",
                "inlinesvg"
            ],
            "options": [
                "setClasses"
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/vendor/modernizr/js/'))
});

gulp.task('livereload', function() {
    tinylr.listen(35729);
});

gulp.task('sass:dist', function () {
    var sass = require('gulp-sass');

    gulp.src('_sass/main.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
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
            '_sass/**/*.scss',
            '!_sass/vendor/**/*.scss'
        ])
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
    gulp.watch(['_sass/**/*.scss'], ['sass:dist']);
    gulp.watch(['_site/**'], notifyLiveReload);
});

gulp.task('default', ['sass:dist', 'server', 'livereload', 'watch']);
gulp.task('travis', ['sass:lint']);
gulp.task('deploy', ['sass:dist', 'modernizr']);
